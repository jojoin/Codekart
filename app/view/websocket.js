/**
 *  错误页面
 */


var stuff = {
    tpl: {body:'websocket'},
    //less:'404'
    //tplpre:{abc:'404'},
    //jslib:'socket.io',
    js:['websocket.ck'
        ,'websocket']
};



//必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('html',stuff); //继承至html



/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取
 */
exports.data = function(callback){
    callback({
        title: 'websocket test'
    });
};
