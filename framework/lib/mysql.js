//加载mysql Module
var mysql = require('mysql');

var dbconfig = {
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
};
var dbconfig_old = {
    host: config.db.host,
    database: 'jojoin_node',
    user: config.db.user,
    password: config.db.password
};

var pool = mysql.createPool(dbconfig);
var pool_old = mysql.createPool(dbconfig_old);


//使用旧数据库表
exports.query_old = function (sql, callback) {
    pool_old.getConnection(function (err, connection) {
        // connected! (unless `err` is set)
        if (err) {
            console.log(err);
            if (callback) callback(err, null);
        } else {
            connection.query(sql, function (err, rows) {
                //错误处理
                if (err) console.log(err);
                if (callback) callback(err, rows);
                connection.end();
            });
        }
    });
};

//使用
exports.query = function (sql, callback) {
    pool.getConnection(function (err, connection) {
        // connected! (unless `err` is set)
        if (err) {
            console.log(err);
            if (callback) callback(err, null);
        } else {
            connection.query(sql, function (err, rows) {
                //错误处理
                if (err) console.log(err);
                if (callback) callback(err, rows);
                connection.end();
            });
        }
    });
};


//转义
exports.escape = function (str) {
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"') ;
};


