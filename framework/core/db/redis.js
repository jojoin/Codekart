
/*********************************************************************************
 * 使用此模块必须用 npm 安装 node_redis 模块
 * 安装命令：npm install redis
 * 源码地址：https://github.com/mranney/node_redis
 */

var redis = require('redis');

var config = require_config('db/redis');
var conf = require_config();


/**
 * 连接池数组
 */
var clientPool = [];
var def = ''; //默认连接池


//建立连接池
for(var k in config){
    def = k;
    break;
    //createOne(k);
}


function createOne(k){
    var conf = config[k];
    if(!conf){
        throw 'No Redis Config "'+k+'" in file: "app/config/db/redis.js" .';
    }
    var con=null;
    try{
        con = redis.createClient(conf);
    }catch(e){
        throw 'Cannot Create Redis Client "'+k+'"';
    }
    //连接关闭时，再次连接
    con.on("end", function (err) {
        //console.log('end');
        createOne(k); //错误退出
        //clientPool[k] = connection(config[k],end);
    });
    //连接错误
    //clientPool[k].on("error", function (err) {
    //    console.log(err);
    //});
    if(conf.select){
        con.select(conf.select); //默认选择库
    }
    return con;
}





/**
 * 获取连接池
 */
function getClientByName(name){
    if(!def){
        throw 'No Redis Config in file: "app/config/db/redis.js" .';
    }
    if(!name) name = def;
    if(!clientPool[name]){
        if(conf.debug){
            clientPool[name] = createOne(name);  //错误退出
        }else{
            try{
                clientPool[name] = createOne(k);
            }catch(e){
                clientPool[name] = null;
            }
        }
    }
    return clientPool[name];

}



exports.getClient = getClientByName;



