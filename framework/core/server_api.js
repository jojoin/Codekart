/**
 * 数据接口服务器
 */

var route = require_core('route');
var json = require_tool('json');


exports.render = function(request,response){

    /*路由 api 处理程序*/
    var msg = route.match(request.url,'api');
    if(msg){ //匹配到处理程序，加载
        var conThis = new This(request, response); //本地服务对象
        try{
            require_app(msg.controller)[msg.action].call(conThis); //加载并调用方法
        }catch (e){
            response.end('{"code":500,"msg":"程序内部错误"}');
        }
    }else{
        response.end('{"code":404,"msg":"未找到处理程序"}');
    }
};

//gost默认本地对象
function This(request, response){
    this.request = request;
    this.response = response;
    //返回内容
    this.render = function(context){
        var output = context+'';
        this.response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8' });
        this.response.end(output);
    };
    //返回json格式内容
    this.renderJson =  function(data){
        //this.flushCookie(); //设置cookie
        var jsonStr = json.stringify(data);
        this.response.writeHead(200, {'Content-Type': 'application/json','Content-Encoding':'UTF-8'});
        this.response.end(jsonStr);
    };
    //返回gost内容
    this.renderApi = function(code,msg,data){
        var renderObj = {};
        renderObj.code = code;
        renderObj.msg = msg;
        renderObj.data = data || msg;
        this.renderJson(renderObj);
    };
    //返回跳转页面
    this.renderJump =  function(url){
        url = url || this.request.url.query.back_url  || false;
        if(url) this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
        else this.render('must have url get parameter: [back_url]');
    };

    /*
     *  说明：设置COOKIE
     *  设置set_cookie('name', 'initnode', 30, '/');
     *  name    cookie名称
     *  value   cookie值
     *  expires 有效期时间，秒计算
     *  path    有效目录
     *  domain  域名
     */
    this.cookieArr = []; //cookie数组
    this.setCookie = function (name, value, expires, path, domain) {
        var cookieStr = '';
        cookieStr = name + '=' + value + ';';
        if (expires != undefined) {
            expires = parseInt(expires);
            var today = new Date();
            var time = today.getTime() + expires * 1000;
            var new_date = new Date(time);
            var expiresDate = new_date.toGMTString(); //转换成GMT 格式。
            cookieStr += 'expires=' +  expiresDate + ';';
        }
        //console.log('目录');
        //目录
        if (path != undefined) {
            cookieStr += 'path=' +  path + ';';
        }
        //console.log('域名');
        //域名
        if (domain != undefined) {
            cookieStr += 'domain=' +  domain + ';';
        }
        this.cookieArr.push(cookieStr);
        //console.log('push');
        return true;
    };

    /*
     *  说明：删除COOKIE
     *  设置request.delCookie('name');
     *  name    cookie名称
     */
    this.delCookie = function (name) {
        this.setCookie(name,' ',-999);
        return true;
    };

    /*
     *  说明：header头部发送cookie设置信息
     */
    this.flushCookie = function () {
        //console.log('setHeader');
        //console.log(this.cookieArr);
        this.response.setHeader("Set-Cookie", this.cookieArr);
    };


}

