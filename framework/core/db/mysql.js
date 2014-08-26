
/*********************************************************************************
 * 使用此模块必须用npm安装mysql模块
 * 安装命令：npm install mysql
 * 源码地址：https://github.com/felixge/node-mysql
 */

var mysql = require('mysql');

var config = load.config();
var conf = load.config('database').mysql;

if(!conf){
    var cfg = 'app/config/';
    if(ENVIRONMENT){
        cfg += ENVIRONMENT+'/'
    }
    cfg += 'database.js';
    log('Error: Have no mysql configs in the "'+cfg+'" !');
}






var poolCluster = mysql.createPoolCluster();

for(var c in conf){
    poolCluster.add(c,conf[c]);
}



var currentConf = '';

/**
 * 当前选择使用的数据库连接名称，为空则任意
 */
exports.server = function(current){
    currentConf = current;
};


/**
 * 执行 SQL 语句
 * @param query : SQL 语句
 * @param callback : 请求回调
 */
exports.query = function(query,callback){
    poolCluster.getConnection(currentConf, function (err, connection){
        if(err){
            if(config.debug){
                log(err);
            }
            if(callback) callback(err,null);
            return;
        }
        connection.query(query, function(err, rows) {
            // And done with the connection.
            if(callback) callback(err,rows);
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
        });
    });
};


/**
 * mysql数据查询
 */
//exports.selectObject = function(table,columns){
exports.Select = function(table,columns){
    this._columns = [];
    this._where = {};
    this._table = '';
    this._order = '';
    this._group = '';
    this._limit = '';
    this._addition = ''; //追加到SQL语句后面的内容
    //格式化数据
    this.sql = '';
    this._sql = 'SELECT * FROM ??';
    this._param = [];

    //构造参数
    if(table){
        this._table = table;
    }
    if(columns){
        this.columns(columns);
    }

    //设置查询字段
    //noesc  放弃对 columns 调用mysql.escapeId()
    this.columns = function(item,noesc){
        if(!item){
            return this;
        }
        if(noesc || checkNoescCol(item)){
            this._sql.replace(/SELECT\s(.+)\sFROM/,'SELECT '+item+' FROM');
            this._columns = '';
        }else{
            this._columns = item;
        }
        return this;
    };

    //添加 where 语句
    callAddWhere.call(this);

    this.table = function(item){
        this._table = item;
        return this;
    };
    this.order = function(item){
        this._order = item;
        return this;
    };
    this.group = function(item){
        this._group = item;
        return this;
    };
    this.limit = function(item){
        this._limit = item;
        return this;
    };
    this.addition = function(item){
        this._addition = item;
        return this;
    };

    //建立查询
    callQuery.call(this,['_table']);

    //生成 SQL 语句
    this.createSQL = function(){
        if(this.sql){
            return this.sql; //避免重复创建
        }
        if(this._columns && typeof this._columns=='string'){
            this._columns = this._columns.split(',');
        }
        if(this._columns && this._columns.length>0){
            this._sql = this._sql.replace('*','??');
            this._param.push(this._columns);
        }
        this._param.push(this._table);

        //组装 where 语句
        callAssembleWhere.call(this);

        if(this._order){
            this._sql += ' ORDER BY '+this._order;
        }
        if(this._group){
            this._sql += ' GROUP BY '+this._group;
        }
        if(this._limit){
            this._sql += ' LIMIT '+this._limit;
        }
        if(this._addition){
            this._sql += ' '+this._addition;
        }

        //log(this._param);
        //log(this._sql);
        //生成 SQL 语句
        return this.sql = mysql.format(this._sql, this._param);
    }

};


/**
 * mysql 数据插入
 */
exports.Insert = function(table,data){
    this._table = '';
    this._data = null;
    //格式化数据
    this.sql = '';
    this._sql = 'INSERT INTO ? SET ?';

    //构造参数
    if(table){
        this._table = table;
    }
    if(data){
        this._data = data;
    }

    //建立查询
    callQuery.call(this,['_table','_data']);


    //生成 SQL 语句
    this.createSQL = function(){
        if(this.sql){
            return this.sql; //避免重复创建
        }
        //生成 SQL 语句
        return this.sql = mysql.format(this._sql, [this._table,this._data]);
    }

};


/**
 * mysql 数据更新
 */
exports.Update = function(table,data){
    this._table = '';
    this._data = null;
    this._where = {};
    //格式化数据
    this.sql = '';
    this._sql = 'UPDATE ? SET ?';
    this._param = [];

    //构造参数
    if(table){
        this._table = table;
    }
    if(data){
        this._data = data;
    }

    callAddWhere.call(this);


    //建立查询
    callQuery.call(this,['_table','_data']);


    //生成 SQL 语句
    this.createSQL = function(){
        if(this.sql){
            return this.sql; //避免重复创建
        }

        this._param.push(this._table);
        this._param.push(this._data);
        //组装where语句
        callAssembleWhere.call(this);
        //生成 SQL 语句
        return this.sql = mysql.format(this._sql, this._param);
    }

};


/**
 * mysql 数据删除
 */
exports.Delete = function(table){
    this._table = '';
    this._where = {};
    this._limit = '';
    this._addition = ''; //追加到SQL语句后面的内容
    //格式化数据
    this.sql = '';
    this._sql = 'DELETE FROM ?';
    this._param = [];

    //构造参数
    if(table){
        this._table = table;
    }

    //添加 where 语句
    callAddWhere.call(this);

    this.limit = function(item){
        this._limit = item;
        return this;
    };
    this.addition = function(item){
        this._addition = item;
        return this;
    };

    //建立查询
    callQuery.call(this,['_table']);

    //生成 SQL 语句
    this.createSQL = function(){

        if(this.sql){
            return this.sql; //避免重复创建
        }

        this._param.push(this._table);

        //组装where语句
        callAssembleWhere.call(this);

        if(this._limit){
            this._sql += ' LIMIT '+this._limit;
        }
        if(this._addition){
            this._sql += ' '+this._addition;
        }

        //生成 SQL 语句
        return this.sql = mysql.format(this._sql, this._param);
    }

};








/**
 * 组装 where 语句
 */
function callAssembleWhere(){
    var wh = [];
    for(var w in this._where){
        var col = w.split(' ',2);
        if(col.length==2&&col[1]){
            wh.push(mysql.escapeId(col[0])+col[1]+'?');
        }else{
            wh.push(mysql.escapeId(col[0])+'=?');
        }
        this._param.push(this._where[w]);
    }
    if(wh.length>0){
        this._sql += ' WHERE '+wh.join(' AND ');
    }
}


/**
 * 添加 where 语句
 */
function callAddWhere(){
    this.where = function(name,value){
        if(name===null){ //清除之前的
            return this._where = {};
        }
        if(typeof name=='string'){
            this._where[name] = value;
        }
        if(typeof name=='object'){
            for(var n in name){
                this.where(n,name[n]);
            }
        }
        return this;
    };
}


/**
 *
 */
function callQuery(must) {
    //执行查询
    this.must_cols = must;
    this.query = function (callback) {
        //log(this.must_cols);
        for (var m in this.must_cols) {
            var col =  this.must_cols[m];
            if(!this[col]){
                if (callback) {
                    callback('[Error: query param "this.' + col + '" is necessary !]', null);
                }
                return this;
            }
        }
        var sql = this.createSQL();
        log(sql);
        return exports.query(sql, callback);
    };
}


/**
 * 判断 columns 是否不转义
 * @param col
 */
function checkNoescCol(col){
    var it = ['*','(',' as '];
    for(var i in it){
        if(col.toLowerCase().indexOf(it[i])>-1){
            return true;
        }
    }
    return false;
}








/*

var sql = "SELECT ?? FROM ? WHERE ?=?";
var inserts = ['*','users', 'id',123];
sql = mysql.format(sql, inserts);

log(sql);

*/





/*




 connection.query('INSERT INTO posts SET ?', {title: 'test'}, function(err, result) {
 if (err) throw err;

 console.log(result.insertId);
 });



 connection.query('DELETE FROM posts WHERE title = "wrong"', function (err, result) {
 if (err) throw err;

 console.log('deleted ' + result.affectedRows + ' rows');
 })



 connection.query('UPDATE posts SET ...', function (err, result) {
 if (err) throw err;

 console.log('changed ' + result.changedRows + ' rows');
 })



*/



