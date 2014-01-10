/**
 *  主页
 */

//当前页面增加的配置

var stuff = {
    tpl: {body:'home'},
    less:'home'
};


//【继承关键代码】
//继承父级页面 和 必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('html',stuff);  //继承至view/html.js


/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取，不调用则会一直等待不能进行下一步！！！
 * 在callback中返回的变量可以在tpl模板中使用，在这里可以进行数据库的查询等等。
 * 复杂的数据获取和运算，建议放在`app/model`中的模块中进行，在这里可以调用`load.model('model')`加载。
 */
exports.data = function(callback){
    callback({
        title: 'CodeTank  欢迎使用Node.js前后端一体化开发框架 ！'
    });
};
