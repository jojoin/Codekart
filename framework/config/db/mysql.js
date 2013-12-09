
/*********************************************************************************
 * 使用此模块必须用npm安装mysql模块
 * 安装命令：npm install mysql
 * 源码地址：https://github.com/felixge/node-mysql
 */

module.exports = {
    //默认mysql数据库
    default:{
        host:'127.0.0.1',
        database:'jojoin',
        user:'jojoin',
        password:'jojoin'
    },
    //其他mysql数据库，可定义多个数据库
    other1:{
        host:'127.0.0.1',
        database:'jojoin',
        user:'jojoin',
        password:'jojoin'
    },
    other2:{
        host:'127.0.0.1',
        database:'jojoin',
        user:'jojoin',
        password:'jojoin'
    },
    other3:{
        host:'127.0.0.1',
        database:'jojoin',
        user:'jojoin',
        password:'jojoin'
    }
    //此处添加数据库配置
};