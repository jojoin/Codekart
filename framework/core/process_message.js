/**
 * 进程通信 process_message
 * */

/* 通信格式
{
    on:"event_path"  // 通信分类
    worker_pid: 234 //发送方worker进程pid
    worker_id: 2 //发送方worker id
    send_to_worker:2 //是否转发给其他工作进程

}
 */

/*
Codekart 框架的进程间通信 path 全部加上 ck_ 前缀，避免冲突
 */


var cluster = require('cluster')

    , onFunc = {} //通信处理程序

    ;



// 事件到达  转发处理
function eventOn(path,data){
    if(path in onFunc){ // 事件已经 on 注册
        for(var i in onFunc[path]){ // 挨个调用处理程序
            onFunc[path](data);
        }
    }
}



//主进程 Master
if(cluster.isMaster) {

    // 发送给 Master 进程
    exports.send_to_master = function(path,data){
        data.on = path;
        eventOn(path,data);
    };

    // 发送给 Worker 进程
    exports.send_to_worker = function(worker_id,path,data){
        data = data || {};
        data.on = path;
        if(worker_id>0){
            return cluster.workers[worker_id].send(data);
        }
        //发送给所有工作进程
        for (var id in cluster.workers) {
            cluster.workers[id].send(data);
        }
    };

    //接收来自 Worker 的消息
    process.on('message', function(msg) {
        if(msg.send_to_worker>=0){ //消息转发
            return exports.send_to_worker(msg.send_to_worker,msg.on,msg);
        }
        eventOn(msg.on,msg);
    });

    // 监听处理 socket 数据
    exports.on = function(path,callback){
        if(!onFunc[path]){
            onFunc[path] = [];
        }
        onFunc[path].push(callback);
    };




//工作进程 Worker
}else{

    // 发送给 Worker 进程
    exports.send_to_worker = function(worker_id,path,data){
        data.on = path;
        if(worker_id==cluster.worker.id){
            eventOn(path,data);
        }else{ //发送给其他worker进程  由master 转发
            data.send_to_worker = worker_id;
            exports.send_to_master(path,data);
        }
    };

    // 发送给 Master 进程
    exports.send_to_master = function(path,data){
        data = data || {};
        data.on = path;
        data.worker_pid = cluster.worker.process.pid;
        data.worker_id = cluster.worker.id;
        process.send(data);
    };

    //接收来自 Master 的消息
    process.on('message', function(msg) {
        eventOn(msg.on,msg);
    });


}
