/**
 * 数据接口服务器
 */

var path = require('path');
var route = load.core('server/route');
var view = load.core('view/view');
var callthis = load.core('server/callthis');
var json = load.tool('json');
var config = load.config();

module.exports = function(request,response){
    var pathname = request.url.pathname
        , pathary = splitPathname(pathname)
        , pleg = pathary.length
        , controller = 'index'
        , action = 'index';

    //控制器路由
    if(request.route){ // 已经注册的控制器路由
        controller = request.route.controller;
        action = request.route.action;
    }else if(pleg==1){ //                   /action
            action = pathary[0];
    }else if(pleg==2){ //                   /controller/action
        controller = pathary[0];
        action = pathary[1];
    }else{  //                                      /path/path/controller/action
        controller = path.dirname(pathname);
        action = path.basename(pathname);
    }

    //控制器本地服务对象
    var conThis = new callthis(request, response)
        , ok = true
        , controllerOb;

    //尝试加载控制器
    try{
        controllerOb = load.app('controller/'+controller); //加载并调用方法
    }catch (e){
        ok = false; //调用失败
        view.render(request,response,'404');
    }

    if(!ok) return;

    if(typeof controllerOb[action]!='function'){
        return view.render(request,response,'404');
    }

    //尝试调用控制器方法
    try{
        controllerOb[action].call(conThis); //加载并调用方法
    }catch (e){
        ok = false; //调用失败
        request.error_msg = 'controller ['+controller+'] or action ['+action+'] runtime error !';
        view.render(request,response,'error');
    }

};


function splitPathname(pathname){
    var old = pathname.split('/')
        , ret = [];
    for(var k in old){
        if(old[k]) ret.push(old[k]);
    }
    return ret;
}

