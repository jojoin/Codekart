/**
 * 核心（用户自定义示例）
 */

var view = load.core('!view/view');
var render = load.core('!server/render');
var json = load.tool('!json');

// 表单数据处理模块
var formidable = null;



//表名是框架核心
exports.__framework = true;



/**
 * 返回内容
 */
exports.render = function(context,code,head){
    render.text(this.request,this.response,context,code,head);
};


/**
 * 返回json格式内容
 */
exports.renderJson =  function(data){
    render.json(this.request,this.response,data);
};


/**
 * 返回api内容
 */
exports.renderApi = function(code, msg, data){
    render.api(this.request, this.response, code, msg, data);
};


/**
 * 返回跳转页面
 */
exports.renderJump =  function(url){
    url = url || this.request.url.query.back_url  || false;
    if(url) this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
    else this.render('must have url get parameter: [back_url]');
};

/**
 * 返回move302
 */
exports.render302 = function(url){
    this.response.writeHead(302, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8',
        Location:url});
    this.response.end();
};


/**
 * 重定向视图处理程序
 */
exports.view =  function(path){
    view.render(this.request,this.response,path);
};


/**
 * 说明：设置COOKIE
 * 设置set_cookie('name', 'initnode', 30, '/');
 * name    cookie名称
 * value   cookie值
 * expires 有效期时间，秒计算
 * path    有效目录
 * domain  域名
 */
exports.__cookieArr = []; //cookie数组
exports.setCookie = function (name, value, expires, path, domain) {
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
    this.__cookieArr.push(cookieStr);
    //console.log('push');
    //自动设置
    this.response.setHeader("Set-Cookie", this.__cookieArr);
    return true;
};


/**
 * 说明：删除COOKIE
 * 设置request.delCookie('name');
 *  name  cookie名称
 */
exports.delCookie = function (name,path) {
    path = path || '/';
    this.setCookie(name,'',-9999,path);
    return true;
};


/**
 * !!!弃用!!!
 * 说明：header头部发送cookie设置信息
 */
exports.flushCookie = function () {
    //console.log('setHeader');
    //console.log(this.__cookieArr);
    this.response.setHeader("Set-Cookie", this.__cookieArr);
};



/**
 * 处理表单数据
 */
exports.formdata = function (callback) {
    if(!formidable){ //加载模块
        formidable = require('formidable');
        //开始处理表单
    }
    var form = new formidable.IncomingForm();

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


