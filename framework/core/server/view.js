/**
 * web view 服务器
 *
 */

//var route = load.core('!server/route');
var view = load.core('!view/view');

module.exports = function(request,response){

    /*路由页面处理程序*/

    var viewname =  request.route.view;

    view.render(request,response,viewname);

};




