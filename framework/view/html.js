

//web页面页面定义
var stuff = {
    tpl:{html:'html'},  //页面的tpl模板文件列表  app/resource/tpl
    less:'html'  //页面的css模板文件列表  app/resource/less

};


//必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('base',stuff); //继承至 base



/*

 //调用链测试代码


exports.data = function(callback){
    log('data - html');
    callback({
        title: 'Codekart'
    });

};

exports.predata = function(callback){

    log('predata - html');
    callback({
        title: 'Codekart'
    });

};


exports.aftdata = function(callback){

    log('aftdata - html');

    callback({
        title: 'Codekart'
    });
};


 */