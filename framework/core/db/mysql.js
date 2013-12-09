
/*********************************************************************************
 * 使用此模块必须用npm安装mysql模块
 * 安装命令：npm install mysql
 * 源码地址：https://github.com/felixge/node-mysql
 */

var mysql = require('mysql');

var config = require_config('db/mysql');


/**
 * 连接池数组
 */
var connectionPool = [];
var def = ''; //默认连接池


//建立连接池
for(var k in config){
    if(!def) def = k;
}


/**
 * 获取连接池
 */
function getPool(k){
    if(!def) return null;
    if(!k) k = def;
    if(!config[k]){
        throw 'No Mysql Config "'+k+'" in file: "app/config/db/mysql.js" .';
    }
    if(!connectionPool[k]){
        connectionPool[k] = mysql.createPool(config[k]);
    }
    return connectionPool[k];
}





/**
 * 请求
 */
exports.query = function (sql,name,callback) {
    if(typeof name==='function'){
        callback = name;
        name = def;
    }
    var pool = getPool(name);
    if(!pool){
        if(callback) callback('mysql database "'+name+'" does not exist !'); //数据库不存在错误
        return false;
    }
    pool.getConnection(function (err, connection) {
        if(err){
            //console.log(err);
            if(callback) callback(err);
        }else{
            connection.query(sql, function (err, rows) {
                if (callback) callback(err, rows);
                connection.release(); //释放连接
            });
        }
    });

};


/**
 * mysql字符转义
 */
exports.escape = function (str) {
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'") ;
};





//转义
exports.escape = function (str) {
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"') ;
};


