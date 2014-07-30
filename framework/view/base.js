

//web页面顶级页面定义
exports.stuff = {
    tpl:[],  //页面的tpl模板文件列表  app/resource/tpl
    tplpre:[],  //待用的tpl文件列表 会被加入js文件里面待用  保存在app/resource/tpl文件夹 格式{note_list:'abc/abc'}
    less:[],  //页面的css模板文件列表  app/resource/less
    csslib:[],  //css库文件，在static/csslib目录下
    js:['init.ck'], //页面的js模板文件列表   app/resource/js
    jslib: [],  //js库文件列表，在static/jslib目录下
    inherit:[] //父级页面继承链
};


//var website = load.config('website');

/**
 * tpl模板数据获取函数
 * @param callback 返回模板数据
 */
/*
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
*/


/*

 //调用链测试代码



 exports.data = function(callback,predata){

    setTimeout(function(){
        log('data - base');
        callback({
            title: 'Codekart'
        });
    },3000);
    //log(predata);

};

exports.predata = function(callback){

    setTimeout(function(){
        log('predata - base');
        callback({
            title: 'Codekart'
        });
    },3000);
};


exports.aftdata = function(callback){

    setTimeout(function(){
        log('aftdata - base');
        callback({
            title: 'Codekart'
        });
    },3000)


};


 */