/**
 * web view 服务器
 *
 */

var route = require_core('server/route');
var view = require_core('view');

exports.render = function(request,response){

    /*路由页面处理程序*/

    var msg = route.match(request.url,'view');
    request.msg = msg = msg || {name:'404'}; //未匹配url 则返回404页面
    //console.log(msg);
    //开始处理页面
    view.view(request,response,msg);

};




