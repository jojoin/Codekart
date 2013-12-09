

//web页面跟页面定义

var path = require('path');

exports.mop = {
    name:['html'], //当前文件名和继承链文件名，用于页面数据获取时挨个调用处理方法
    tpl:[{html:'html'}],  //页面的tpl模板文件列表
    tpl_pre:[],  //待用的tpl文件列表 会被加入js文件里面待用  保存在app/view/tpl文件夹 格式{note_list:'abc/abc'}
    less:['html'],  //页面的css模板文件列表
    csslib:[],  //css库文件，在static/csslib目录下
    js:[
        'functions',
        'json',
        'cookie',
        'jq-extend',
        'tmpl',
        'pro'
    ], //页面的js模板文件列表
    jslib:[
        'jquery-2.0.3.min'
    ] //js库文件列表，在static/jslib目录下
};


var website = require_config('website');

/**
 * tpl模板数据获取函数
 * @param callback 返回模板数据
 */
exports.data = function(callback){
    var that = this
        , req = this.request;  //原生的request请求对象
    callback({
        title: website.name,
        time: req.time,
        website: website
    },{
        website: website
    });
};