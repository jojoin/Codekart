/**
 * websocket 服务器模块
 */

var cluster = require('cluster');

var ws;

var config = load.config();

//websocket链接池
var socketPool = [];


/**
 * 启动websocket服务器
 */
exports.run = function(){


    if(config.port.websocket<=0){ //端口小于等于零  则不开启http
        return false;
    }

    var port = getPort();

    //log('ws_port_inc : '+cluster.worker.process.env.ws_port_inc);

    //log('I am worker #' + cluster.worker.id);

    //加载模块
    if(!ws) ws = require('ws');

    var WebSocketServer = ws.Server
        , wss = new WebSocketServer({port: port});
    //log(wss);
    wss.on('connection', function(socket) {

        log('connection !!!');

        //log(socket.upgradeReq.url);
        socket.on('message', function(message) {
            log('received: %s', message);
        });
        socket.send('something');
    });

    log('port ['+port+'] running server websocket');
};


/**
 * http polling ws兼容方案处理
 */
exports.polling = function(request, response){

};


//获取 websocket 监听端口号
function getPort(){
    if(!cluster.isWorker)  return 0;
    return config.port.websocket + parseInt(cluster.worker.process.env.ws_port_inc);
}
