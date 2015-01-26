/**
 * Codekart 框架初始化
 */

var cluster = require('cluster');
var fs = require('fs');
var tppl = load.tool('!tppl');
var file = load.tool('!file');
var object = load.tool('!object');
var path = load.config('!path');
var define = load.config('define');
var config = load.config();

//合并配置
object.extend(define,config);


// master 进程初始化工作
if(cluster.isMaster){


//开始初始化

/**
 * 由 framework/resource/js/init.ck.tpl 模板 tppl 解析
 * 生成 framework/resource/js/init.ck.js 配置文件
 */
var init_file = path.framework+'/resource/js/init.ck.';
fs.readFile(init_file+'tpl', 'utf8',function(err, data){
    if(err){
        if(config.debug) log(err);
        return
    }
    var jsstr;
    try{
        jsstr =  tppl(data, define); //生成正式js文件
    }catch(e){
        if(config.debug) log(e);
        return
    }
    fs.writeFile(init_file+'js',jsstr, function (err) { //写入文件
        if(err){ //文件写入错误
            if(config.debug) log(err);
            return
        }
    });
});






/**
 * 检查目录是否存在   不存在则创建
 */
var mustpath = [
    'static',
    'static/img',
    'static/cssimg',
    'static/js',
    'static/css',
    'static/jslib',
    'static/csslib'
];
for(var p in mustpath){
    var mp = path.base+'/'+mustpath[p];
    if(!fs.existsSync(mp)){
        if(config.debug){
            log('检测目录不存在，创建：'+mp);
        }
        fs.mkdirSync(mp);
    }
}













/****************  end master init ****************/
}






/**
 * 开始 app init 初始化
 */
var initpath = path.app+'/core/init.js';
require(initpath);

/*
file.validPath([initpath],function(p){
    if(p){
        require(initpath);
    }
});
*/









