/**
 * 内存 缓存模块 memcache
 */


var cluster = require('cluster');
var process_message = load.core('!process_message');

var cache = {}; // 供 Master 进程存取
var debug = false;
var hitCount = 0;
var missCount = 0;
var msg_ = 'ck_cache_';  //通信前缀

var arrive_callback = {};



//工作进程 Worker 采用进程间通讯
if(cluster.isWorker) {

    //设置
    exports.set = function(key, value, time){
        process_message.send2master(msg_+'set',{
            key: key,
            value: value,
            time: time
        });
    };

    //读取
    exports.get = function(key, callback){
        if(!arrive_callback[key]){ //已经发送了读取操作
            arrive_callback[key] = [];
            process_message.send2master(msg_+'get',{
                key: key
            });
        }
        arrive_callback[key].push(callback);
    };

    //删除
    exports.del = function(key) {
        process_message.send2master(msg_+'del',{
            key: key
        });
    };

    //清空
    exports.clear = function() {
        process_message.send2master(msg_+'clear',{});
    };

    //读取的数据到达了
    process_message.on(msg_+'arrive',function(data){

        //移除回调
        delete arrive_callback[data.key];
    });


    return ;
}






//主进程 Master 通信支持



process_message.on(msg_+'set',function(data){
    exports.set(
        data.key,
        data.value,
        data.time
    );
});

process_message.on(msg_+'get',function(data){
    //读取数据
    data.data = exports.get(data.key);
    //发送给客户端
    process_message.send2worker(data.worker_id,msg_+'arrive',data);
});

process_message.on(msg_+'del',function(data){
    //删除数据
    exports.del(data.key);
});

process_message.on(msg_+'clear',function(data){
    //清空数据
    exports.clear();
});





//主进程 Master 正式启动 cache 服务

function now() { return (new Date).getTime(); }

exports.set = function(key, value, time, timeoutCallback) {
    if (debug) console.log('caching: '+key+' = '+value+' (@'+time+')');
    var oldRecord = cache[key];
    if (oldRecord) {
        clearTimeout(oldRecord.timeout);
    }

    var expire = time + now();
    var record = {value: value, expire: expire};

    if (!isNaN(expire)) {
        var timeout = setTimeout(function() {
            exports.del(key);
            if (typeof timeoutCallback === 'function') {
                timeoutCallback(key);
            }
        }, time);
        record.timeout = timeout;
    }

    cache[key] = record;
};

exports.del = function(key) {
    if(cache[key]){
        clearTimeout(cache[key].timeout);
        delete cache[key];
    }
};

exports.clear = function() {
    cache = {};
};

exports.get = function(key,callback) {
    var data = cache[key];
    if (typeof data != "undefined") {
        if (isNaN(data.expire) || data.expire >= now()) {
            if (debug) hitCount++;
            if (callback) callback(data.value);
            return data.value;
        } else {
            // free some space
            if (debug) missCount++;
            exports.del(key);
        }
    } else if (debug) {
        missCount++;
    }
    if (callback) callback(null);
    return null;
};

exports.size = function() {
    var size = 0, key;
    for (key in cache) {
        if (cache.hasOwnProperty(key))
            if (exports.get(key) !== null)
                size++;
    }
    return size;
};

exports.memsize = function() {
    var size = 0, key;
    for (key in cache) {
        if (cache.hasOwnProperty(key))
            size++;
    }
    return size;
};

exports.debug = function(bool) {
    debug = bool;
};

exports.hits = function() {
    return hitCount;
};

exports.misses = function() {
    return missCount;
};

