
/*********************************************************************************
 * 使用此模块必须用npm安装mysql模块
 * 安装命令：npm install mysql
 * 源码地址：https://github.com/felixge/node-mysql
 */

module.exports = {
    //默认mysql数据库
    default:{
        host:'127.0.0.1',
        database:'',
        user:'',
        password:''
    },
    //其他的mysql数据库，可设置多个
    online:{
        host:'127.0.0.1',
        database:'',
        user:'',
        password:''
    }
    //此处添加数据库配置
};