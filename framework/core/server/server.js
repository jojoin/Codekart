
//服务器模块

var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length; //cpu核心数
var querystring = require('querystring');
var server_static = require_core('!server/static');
var server_api = require_core('!server/api');
var server_view = require_core('!server/view');
var config = require_config();
var cpath = require_config('!path');
var array = require_tool('!array');

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
        return createServer(); //暂时不开启多核

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
        //处理url参数
        request.time_ms = new Date().getTime(); //请求进入时间 ms 毫秒
        request.time = parseInt(request.time_ms/1000); //请求进入时间戳
        request.url = url.parse(request.url,true);
        request.get = request.url.query;
        //获取路由
        var met = requestSort(request);
        //是否提交二进制数据！！！！！！
        if (met=='binary'&& request.method.toLowerCase() == 'post') {
            return dealwithRequest(request,response,met);
        }
        request.postData = '';
        request.on('data',function(chunk){
            request.postData += chunk;
            // console.log('event post on');
        });
        request.on('end', function(){
            //数据全部到达，开始处理程序
            dealwithRequest(request, response,met);
            //console.log('event post end');
        });
    }).listen(config.port.http);

    console.log('port '+config.port.http+' have been listening !');
}


/**
 * 所有的请求都由此函数统一处理
 */
function dealwithRequest(request, response, met){
    //console.log(request.url);
    //console.log(met);
    if(met!='static'){
        //处理cookie参数
        request.cookie = {};
        request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
            var parts = Cookie.split('=');
            //console.log(parts);
            request.cookie[ parts[0].trim() ] = ( parts[1] || '' ).trim();
        });
        //处理post数据
        if(request.postData) request.post = querystring.parse(request.postData);
    }
    //传递给路由规则处理
    route(request,response,met);
}


/**
 *  路由处理服务器
 *  请求服务路由，静态文件服务，数据接口服务，web接口
 */
function route(request,response,met){
    //console.log(met);
    if(met=='static') server_static.render(request,response);
    else if(met=='api'||met=='binary') server_api.render(request,response);
    else if(met=='view') server_view.render(request,response);
}



/**
 * 获取或者验证请求类型，静态、数据服务、二进制数据提交
 */
function requestSort(request,sort){
    var sorts = ['api','binary']
        , leg = sorts.length
        , pathname = request.url.pathname
        , re =  'view'; //默认为页面服务
    for(var i=0;i<leg;i++){
        if(pathname.indexOf('/'+sorts[i]+'/')==0){
            re = sorts[i];
        }
    }
    var type = path.extname(pathname).replace('.','');  //获取文件扩展名
    if(type) re = 'static'; //静态文件服务
    return sort?sort==re:re;
}

