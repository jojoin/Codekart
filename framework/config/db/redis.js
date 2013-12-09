
/*********************************************************************************
 * 使用此模块必须在用 npm 安装 node_redis 模块
 * 安装命令：npm install redis
 * 源码地址：https://github.com/mranney/node_redis
 */

module.exports = {
    //默认 redis 数据库
    default:{
        host:'183.129.179.180',
        port:'6379',
        options:{
            auth_pass: ''
        }
    },
    //其他 redis 数据库，可定义多个数据库，自定义名称
    other:{
        host:'183.129.179.180',
        port:'6379',
        options:{
            auth_pass: ''
        }
    }
    //此处添加数据库配置
};