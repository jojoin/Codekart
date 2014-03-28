
/*********************************************************************************
 * 使用此模块必须用npm安装mysql模块
 * 安装命令：npm install mysql
 * 源码地址：https://github.com/felixge/node-mysql
 */

module.exports.nysql = {
    //默认mysql数据库
    default:{
        host:'127.0.0.1',
        database:'',
        user:'',
        password:''
    },
    //向上数据库
    online:{
        host:'127.0.0.1',
        database:'',
        user:'',
        password:''
    },
    //本地调试数据库
    local:{
        host:'127.0.0.1',
        database:'',
        user:'',
        password:''
    }
    //此处添加数据库配置
};




/*********************************************************************************
 * 使用此模块必须在用 npm 安装 node_redis 模块
 * 安装命令：npm install redis
 * 源码地址：https://github.com/mranney/node_redis
 */

module.exports.redis = {
    //默认 redis 数据库
    default:{
        host:'127.0.0.1',
        port:'6379',
        select:1, //默认选择的库
        options:{
            auth_pass: ''
        }
    },
    //其他 redis 数据库，可定义多个数据库，自定义名称
    other:{
        host:'127.0.0.1',
        port:'6379',
        select:0, //默认选择的库
        options:{
            auth_pass: ''
        }
    }
    //此处添加数据库配置
};