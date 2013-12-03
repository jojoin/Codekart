
/*******************************************************************************
 *
 * mysql数据库配置
 * 注意：需要安装node-mysql模块，模块github地址：
 * https://github.com/felixge/node-mysql
 */


exports = {
    //默认mysql数据库
    default:{
        host:'127.0.0.1',
        user:'',
        password:'',
        database:''
    },
    //其他mysql数据库，可定义多个数据库
    other:{
        host:'127.0.0.1',
        user:'',
        password:'',
        database:''
    }
    //此处添加数据库配置
};