/**
 *  错误页面
 */



var stuff = {
    tpl: {body:'error'},
    less:'error'
};



//必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('html',stuff); //继承至html



/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取
 */
exports.data = function(callback){
    //500 请求头
    this.response.writeHead(500,
        { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8'});

    var msg = this.request.error_msg || '';
    callback({
        title: ':( System Error',
        error_msg:msg
    });
};
