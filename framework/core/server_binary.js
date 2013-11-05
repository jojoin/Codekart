/**
 * 数据接口服务器
 */

var route = require_core('route');
var json = require_tool('json');


exports.render = function(request,response){
    /*路由 binary 处理程序*/
    var msg = route.match(request.url,'binary');
    if(msg){ //匹配到处理程序，加载
        var conThis = new This(request,response); //本地服务对象
        try{
            require_binary(msg.controller)[msg.action].call(conThis); //加载并调用方法
        }catch (e){
            response.end('error: Internal program error !');
        }
    }else{
        response.end('error: Handler not found !');
    }
};



/**
* 处理程序 this 对象
*/
function This(request,response){
    this.request = request;
    this.response = response;
    //返回内容
    this.render = function(context){
        var output = context+'';
        this.response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8' });
        this.response.end(output);
    };
    //返回跳转页面
    this.renderJump =  function(url){
        url = url || this.request.get.back_url  ||  this.request.url.href;
        this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
    };

}
