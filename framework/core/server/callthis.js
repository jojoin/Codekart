
var view = load.core('!view/view');
var render = load.core('!server/render');
var json = load.tool('json');

var formidable;
var form;



/**
 * this本地对象
 */
module.exports = function(request, response){
    this.request = request;
    this.response = response;
    //返回内容
    this.render = function(context,code,head){
        render.text(this.request,this.response,context,code,head);
    };
    //返回json格式内容
    this.renderJson =  function(data){
        render.json(this.request,this.response,data);
    };
    //返回gost内容
    this.renderApi = function(data, msg, code){
        render.api(this.request, this.response, data, msg, code);
    };
    //返回跳转页面
    this.renderJump =  function(url){
        url = url || this.request.url.query.back_url  || false;
        if(url) this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
        else this.render('must have url get parameter: [back_url]');
    };
    this.render302 = function(url){
        var output = context+'';
        this.response.writeHead(302, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8',
            Location:url});
        this.response.end(output);
    };
    //重定向视图处理程序
    this.view =  function(path){
        view.render(this.request,this.response,path);
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
        //自动设置
        this.response.setHeader("Set-Cookie", this.cookieArr);
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
     *  !!!弃用!!!
     *  说明：header头部发送cookie设置信息
     */
    this.flushCookie = function () {
        //console.log('setHeader');
        //console.log(this.cookieArr);
        this.response.setHeader("Set-Cookie", this.cookieArr);
    };

    /**
     * 处理表单数据
     */
    this.formdata = function (callback) {
        if(!formidable){ //加载模块
            formidable = require('formidable');
            //开始处理表单
            form = new formidable.IncomingForm();
        }

        form.parse(this.request,callback);
        /*
        form.parse(this.request, function(err, fields, files) {
            //res.writeHead(200, {'content-type': 'text/plain'});
            //res.write('received upload:\n\n');
            //res.end(util.inspect({fields: fields, files: files}));
        });
        */
        /*
         {   fields: { title: 'something' },
             files:
                 { upload:
                     { domain: null,
                     _events: {},
                     _maxListeners: 10,
                     size: 307905,
                     path: 'C:\\Users\\DELL\\AppData\\Local\\Temp\\46212f78b8ce64721d57b83111d3e829',
                     name: '1.jpg',
                     type: 'image/jpeg',
                     hash: null,
                     lastModifiedDate: Fri Jul 04 2014 15:51:32 GMT+0800 (...),
                     _writeStream: [Object] } }
         }
        */

    }


};

