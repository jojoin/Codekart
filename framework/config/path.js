

/*
* 路径配置
* */

var path = require('path');

//向上返回两层，到达框架跟目录
var b = path.dirname(path.dirname(__dirname)); //codetank文件夹路径

//路径配置
module.exports = {

    base:b,
    app: b+'/app', //程序目录
    framework: b+'/framework', //框架核心目录

    api: b+'/app/api', //api
    model: b+'/app/model', //

    js: b+'/app/resource/js', //前端js文件
    less: b+'/app/resource/less', //前端less文件
    tpl: b+'/app/resource/tpl', //前端tpl模板文件

    static:b+'/static',   //静态文件目录
    tmp:b+'/tmp'   //临时文件目录
};