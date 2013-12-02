/**
 * 全局函数
 */


var file = require('../tool/file.js');



/**
 * 加载核心模块
 */
global.require_core = function(name,ext){
    return require(config.path.framework+'/core/'+ name+'.js');
};


/**
 * 加载程序模块
 */
global.require_model = function(name,ext){
    return require(config.path.model+'/'+ name+'.js');
};



/**
 * 加载库
 */
var lib_item_cache = {};
global.require_lib = function(name,ext){
    ext = ext || 'js';
    ext = '.'+ext;
    //查看缓存，加载过路径则马上返回
    var cache = lib_item_cache[name];
    if(cache) return require(cache);
    //加载新库
    var base1 = config.path.framework+'/lib/'+name
        , base2 = config.path.app+'/lib/'+name
        , path_ary = [
            base1+ext,
            base1+'/index'+ext,
            base1+'/'+name+ext,
            base2+ext,
            base2+'/index'+ext,
            base2+'/'+name+ext
        ];
    //查找可用路径
    var path = file.validPath(path_ary);
    if(path){
        lib_item_cache[name] = path;
        return require(path);
    }else{
        return require(base2); //必将报错，用于提示
    }
};



/**
 * 加载工具
 */
var tool_item_cache = {};
global.require_tool = function(name,ext){
    ext = ext || 'js';
    ext = '.'+ext;
    //查看缓存，加载过路径则马上返回
    var cache = lib_item_cache[name];
    if(cache) return require(cache);
    //加载新库
    var base1 = config.path.framework+'/tool/'+name
        , base2 = config.path.app+'/tool/'+name
        , path_ary = [
            base1+ext,
            base1+'/index'+ext,
            base1+'/'+name+ext,
            base2+ext,
            base2+'/index'+ext,
            base2+'/'+name+ext
        ];
    //查找可用路径
    var path = file.validPath(path_ary);
    if(path){
        tool_item_cache[name] = path;
        return require(path);
    }else{
        return require(path_ary[1]); //必将报错，用于提示
    }

};



/**
 * 加载api处理程序
 */
global.require_app = function(name,ext){
    return require(config.path.app+'/'+name+'.js');
};



/**
 * 加载页面处理程序
 */
global.require_view = function(name,ext){
    return require(config.path.app+'/view/'+name+'.js');
};



/**
 * 加载配置文件
 */
global.require_config = function(name,ext){
    if(!name) name = 'config'; //默认文件
    return require(config.path.app+'/config/'+name+'.js');
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




var path = require('path');
var object = require_tool('object');


/**
 * 继承页面
 */
global.inheritView = function(name){

    var parent = require_view(name); //父级页面
    return  object.clone(parent.mop); //拷贝文件设置

};





//获取当前时间戳 秒数/毫秒
global.time = function(ms){
    var d  = new Date().getTime();
    if(ms) return d;
    else return parseInt(d/1000);
};


