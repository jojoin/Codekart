
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
        cfg += ENVIRONMENT+'/';
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

    this._sql = 'SELECT * FROM ??';

    var com = ['columns','table','where','order','group','limit','addition'];

    //添加组装语句
    callAppendParam.call(this,com);

    //生成 SQL 语句
    callCreateSQL.call(this,com);

    //建立查询
    callQuery.call(this,['table']);

    //构造参数
    if(table){
        this._table = table;
    }
    if(columns){
        this.columns(columns);
    }


};


/**
 * mysql 数据插入
 */
exports.Insert = function(table,data){
    //格式化数据
    this._sql = 'INSERT INTO ? SET ?';

    var com = ['table','data'];

    //添加组装语句
    callAppendParam.call(this,com);

    //生成 SQL 语句
    callCreateSQL.call(this,com);

    //建立查询
    callQuery.call(this,['table','data']);

    //构造参数
    if(table){
        this._table = table;
    }
    if(data){
        this._data = data;
    }

};


/**
 * mysql 数据更新
 */
exports.Update = function(table,data){
    this._sql = 'UPDATE ? SET ?';

    var com = ['table','data','where','limit'];

    //添加组装语句
    callAppendParam.call(this,com);

    //生成 SQL 语句
    callCreateSQL.call(this,com);

    //建立查询
    callQuery.call(this,['table','data']);

    //构造参数
    if(table){
        this._table = table;
    }
    if(data){
        this._data = data;
    }

};


/**
 * mysql 数据删除
 */
exports.Delete = function(table){
    this._sql = 'DELETE FROM ?';

    var com = ['table','where','limit'];

    //添加组装语句
    callAppendParam.call(this,com);

    //生成 SQL 语句
    callCreateSQL.call(this,com);

    //建立查询
    callQuery.call(this,['table']);

    //构造参数
    if(table){
        this._table = table;
    }
};


/**
 * 组装 参数 语句
 */
function callAssembleParam(para){
    if(!para){
        return this;
    }
    if(typeof para=='object'){
        for(var p in para){
            callAssembleParam.call(this,para[p]);
        }
        return;
    }
    if(para=='columns'){
        if(this._columns && typeof this._columns=='string'){
            this._columns = this._columns.split(',');
        }
        if(this._columns && this._columns.length>0){
            this.sql = this.sql.replace('*','??');
            this._param.push(this._columns);
        }
    }
    if(para=='table'){
        this._param.push(this._table);
    }
    if(para=='data'){
        this._param.push(this._data);
    }
    if(para=='where'){
        //组装where语句
        callAssembleWhere.call(this);
    }
    if(para=='order'){
        if (this._order) {
            this.sql += ' ORDER BY ' + this._order;
        }
    }
    if(para=='group'){
        if (this._group) {
            this.sql += ' GROUP BY ' + this._group;
        }
    }
    if(para=='limit'){
        if(this._limit){
            this.sql += ' LIMIT '+this._limit;
        }
    }
    if(para=='addition'){
        if(this._addition){
            this.sql += ' '+this._addition;
        }
    }

}


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
        this.sql += ' WHERE '+wh.join(' AND ');
    }
}


/**
 * 条件语句
 */
function callAppendParam(para){
    //开始添加
    if(!para){
        return this;
    }
    if(typeof para=='object'){
        //必备参数
        this.sql = '';
        this._param = [];
        for(var p in para){
            callAppendParam.call(this,para[p]);
        }
        return;
    }
    if(para=='columns'){
        //设置查询字段
        //noesc  放弃对 columns 调用mysql.escapeId()
        this._columns = [];
        this.columns = function(item,noesc){
            if(!item){
                return this;
            }
            if(noesc || checkNoescCol(item)){
                this._sql = this._sql.replace(/SELECT\s(.+)\sFROM/,'SELECT '+item+' FROM');
                this._columns = '';
            }else{
                this._columns = item;
            }
            return this;
        };
    }
    if(para=='table'){
        this._table = '';
        this.table = function(item){
            this._table = item;
            return this;
        };
    }
    if(para=='data'){
        //组装where语句
        callAppendData.call(this);
    }
    if(para=='where'){
        //组装where语句
        callAppendWhere.call(this);
    }
    if(para=='order'){
        this._order = '';
        this.order = function(item){
            this._order = item;
            return this;
        };
    }
    if(para=='group'){
        this._group = '';
        this.group = function(item){
            this._group = item;
            return this;
        };
    }
    if(para=='limit'){
        this._limit = '';
        this.limit = function(item){
            this._limit = item;
            return this;
        };
    }
    if(para=='addition'){
        this._addition = '';
        this.addition = function(item){
            this._addition = item;
            return this;
        };
    }

}


/**
 * 添加 where 语句
 */
function callAppendWhere(){
    this._where = {};
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
 * 添加 where 语句
 */
function callAppendData(){
    this._data = {};
    this.data = function(name,value){
        if(name===null){ //清除之前的
            return this._data = {};
        }
        if(typeof name=='string'){
            this._data[name] = value;
        }
        if(typeof name=='object'){
            for(var n in name){
                this.data(n,name[n]);
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
            if(!this['_'+col]){
                if (callback) {
                    callback('[Error: query param "this._' + col + '" is necessary !]', null);
                }
                return this;
            }
        }
        var sql = this.createSQL();
        //log(sql);
        return exports.query(sql, callback);
    };
}


/**
 *
 */
function callCreateSQL(com){

    //生成 SQL 语句
    this.createSQL = function(){

        //复位
        this.sql = this._sql;
        this._param = [];

        //组装 SQL
        callAssembleParam.call(this,com);

        //生成 SQL 语句
        //log(this.sql);
        //log(this._param);
        return mysql.format(this.sql, this._param);
    }
}




/**
 * 判断 columns 是否不转义
 * @param sqlstr
 */
function mysqlFormat(sqlstr,param){


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



