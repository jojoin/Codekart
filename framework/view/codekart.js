/**
 *  主页
 */


//web页面顶级页面定义
var stuff = {
    tpl:{body:'codekart'},  //页面的tpl模板文件列表  app/resource/tpl
    less:'codekart',  //页面的css模板文件列表  app/resource/less
};

//【继承关键代码】
//继承父级页面 和 必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('html',stuff); //继承至html


//var website = load.config('website');


/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取，不调用则会一直等待不能进行下一步！！！
 * 在callback中返回的变量可以在tpl模板中使用，在这里可以进行数据库的查询等等。
 * 复杂的数据获取和运算，建议放在`app/model`中的模块中进行，在这里可以调用`load.model('model')`加载。
 */

exports.data = function(callback){
    callback({
        title: 'Codekart'
    });
};