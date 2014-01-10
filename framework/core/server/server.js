
//服务器模块

var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length; //cpu核心数
var querystring = require('querystring');
var server_static = load.core('!server/static');
var server_controller = load.core('!server/controller');
var server_view = load.core('!server/view');
var route = load.core('!server/route');
var config = load.config();
var cpath = load.config('!path');
var array = load.tool('!array');



//工作者进程
var workers = [];

/*
if(config.debug){
    // 监测文件改动，如果有修改，就将所有的 worker kill 掉
    fs.watch(cpath.base, function(event, filename) {
        console.log('kill all worker !');
        workers.forEach(function(worker) {
            worker.kill();
        });
    });
}

*/

/**
 * 启动http服务器
 */
exports.run = function(){
    if(config.cluster){
        return createClusterServer();
    }else{
        return createServer(); //不开启多核

    }

};


/**
 * 创建多核支持的服务器
 */
function createClusterServer(){

    //开启多核多个进程利用多核cpu
    if(cluster.isMaster) {
        // 根据 CPU 个数来启动相应数量的 worker
        if(config.worker>0) numCPUs = config.worker;
        for (var i = 0; i < numCPUs; i++) {
            workers.push(cluster.fork());
        }
        cluster.on('fork', function(worker) {
            console.log('worker ' + worker.process.pid + ' starting...');
        });
        cluster.on('exit', function(worker) {
            console.log('worker ' + worker.process.pid + ' died.');
            //删除退出的worker
            array.matchItem(workers,'id',worker.id,true);
            workers.push(cluster.fork());
        });
        return false;
    } else {
        // Workers can share any TCP connection
        // In this case its a HTTP server
        return createServer();
    }
}



/**
 * 创建http服务器
 */
function createServer(){

    //console.log();
    http.createServer(function(request, response){
        //解析url
        request.url = url.parse(request.url,true);
        //请求类型
        var method = request.method.toLowerCase()
            , sort = getRequestSort(request, true);
        if(sort!='static'){  //静态文件请求，不做request扩展处理
            expandRequest(request);
        }
        //判断是否为get或二进制/文件post请求，直接响应
        if(method == 'get'
            || request.headers['content-type'] == 'multipart/form-data'){
            return routeRequest(request,response,sort);
        }
        var postData = '';
        request.on('data',function(chunk){
            postData += chunk;
        });
        request.on('end', function(){
            //处理post数据
            request.post = querystring.parse(postData);
            routeRequest(request,response,sort);
        });

    }).listen(config.port.http);

    console.log('listening port '+config.port.http+' successfully !');
}





/**
 * 扩展 request 对象
 */
function expandRequest(request){
    request.time_ms = new Date().getTime(); //请求进入时间 ms 毫秒
    request.time = parseInt(request.time_ms/1000); //请求进入时间戳
    request.get = request.url.query;
    //处理cookie参数
    request.cookie = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        //console.log(parts);
        request.cookie[ parts[0].trim() ] = ( parts[1] || '' ).trim();
    });
}




/**
 *  路由处理服务器
 *  请求服务路由，静态文件服务，数据接口服务，web接口
 */
function routeRequest(request,response,sort){
    //console.log(met);
    if(sort=='static')
        server_static(request,response);
    else if(sort=='controller')
        server_controller(request,response);
    else if(sort=='view')
        server_view(request,response);
}



/**
 * 获取或者验证请求类型，静态、数据服务、二进制数据提交
 * exp 表示是否扩展request
 */
function getRequestSort(request,exp){

    var pathname = request.url.pathname;

    //是否为注册的controller请求
    var isCtrl = route.match(pathname,'controller');
    if(isCtrl){
        if(exp){//扩展request
            request.url.param = isCtrl.param;
            request.route = isCtrl.route;
        }
        return 'controller';
    }

    //是否为页面请求
    var isView = route.match(pathname,'view');
    if(isView){
        if(exp){//扩展request
            request.url.param = isView.param;
            request.route = isView.route;
        }
        return 'view';
    }

    //是否为静态文件请求
    var type = path.extname(pathname).replace('.','');  //获取文件扩展名
    if(type) return 'static'; //静态文件服务


    return 'controller'; //默认交由controller处理
}

