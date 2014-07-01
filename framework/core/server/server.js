
//服务器模块

var cluster = require('cluster');
var numCPUs = require('os').cpus().length; //cpu核心数
var server_websocket = load.core('!server/websocket');
var server_http = load.core('!server/http');
var config = load.config();

/**
 * 启动http服务器
 */
exports.run = function(){

    //开启多核多个进程利用多核cpu
    if(cluster.isMaster) {

        //工作者进程
        // 根据 CPU 个数来启动相应数量的 worker
        if(config.worker>0) numCPUs = config.worker;
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork({ws_port_inc:i});
            wsPortInc.set(i+1,i);
        }
        cluster.on('fork', function(worker) {
            //console.log(worker);
            console.log('worker pid ' + worker.process.pid + ' starting ...');
            //
        });
        cluster.on('exit', function(worker) {
            console.log('worker pid ' + worker.process.pid + ' died.  the other one is forking ...');
            //console.log(worker);
            var wsport = wsPortInc.change(worker.id)
                , forkdelay = config.forkdelay || 1000;
            setTimeout(function(){
                cluster.fork({ws_port_inc:wsport});
            },forkdelay);
        });
    } else {
        // 当为Worker 进程时  启动服务器
        server_http.run();
        server_websocket.run();
    }
};


/**
 * 监听websocket端口管理器
 */
var wsPortInc = (function(){

    var A = {}
        , next_wid = 0
        , Ports = {};

    A.set = function(worker_id,port){
        Ports['id_'+worker_id] = port;
        next_wid = worker_id+1;
    };

    A.change = function(old_wid){
        var oldport = Ports['id_'+old_wid];
        Ports['id_'+next_wid] = oldport;
        delete Ports['id_'+old_wid];
        //console.log(Ports);
        next_wid++;
        return oldport;

    };


    return A;
})();







