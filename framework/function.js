/**
 * 全局函数
 */

var fs = require('fs');
var path = require('path');
var c_path = require('./config/path.js');
var file = require('./tool/file.js');
var array = require('./tool/array.js');
var object = require('./tool/object.js');


var model_name_cache = [];


/**
 * 加载核心模块
 */
global.require_core = function(name,ext){
    return preload('core',name,ext);
};


/**
 * 加载程序模块
 */
global.require_model = function(name,ext){
    ext = suffix(ext);
    return require(c_path.model+'/'+ name+ext);
};



/**
 * 加载库
 */
global.require_lib = function(name,ext){
    return preload('lib',name,ext);
};



/**
 * 加载工具
 */
global.require_tool = function(name,ext){
    return preload('tool',name,ext);
};



/**
 * 加载app下处理程序
 */
global.require_app = function(name,ext){
    ext = suffix(ext);
    return require(c_path.app+'/'+name+ext);
};



/**
 * 加载页面处理程序
 */
global.require_view = function(name,ext){
    return preload('view',name,ext,{noerror:true});
};



/**
 * 加载配置文件
 */
global.require_config = function(name,ext){
    if(!name) name = 'config'; //默认文件
    return preload('config',name,ext);
};



/**
 * 处理文件名后缀
 * @param ext 文件名后缀
 */

function suffix(ext){
    ext = ext || 'js';
    ext = '.'+ext;
    return ext;
}



/**
 * 返回加载模块解析后的文件名
 * @param name 文件名或路径
 */

function preload(base,name,ext,opt){
    var bname = base+'/'+name;
    //console.log(bname);
    //检查缓存，加载过路径则马上返回
    var cache = array.matchItem(model_name_cache,'name',bname);
    if(cache&&cache.path) return require(cache.path);

    //没有缓存加载新库
    var p1 = c_path.app+'/'+base+'/'
        , p2 = c_path.framework+'/'+base+'/';
    //如果模块第一个字符为!感叹号，则默认先加载框架模块，否则加载用户模块
    if('!'===name.charAt(0)){
        var p = p1;
        p1 = p2;
        p2 = p; //交换顺序
        name = name.substr(1); //去除!符号
    }
    p1 += name;
    p2 += name;
    //后缀
    ext = suffix(ext);
    var path_ary = [
        p1+ext,
        p1+'/index'+ext,
        p1+'/'+name+ext,
        p2+ext,
        p2+'/index'+ext,
        p2+'/'+name+ext
    ];
    //console.log(path_ary);
    //查找可用路径
    var pathone = file.validPath(path_ary);
    //console.log(pathone);
    if(pathone){
        model_name_cache.push({name:bname,path:pathone});
        return require(pathone);
    }else{
        if(opt&&opt.noerror){ //返回错误，而不是中断执行
            return null;
        }else{
            return require(path_ary[1]); //不存在模块，将报错，用于错误提示
        }
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 继承页面
 */
global.inheritView = function(parent,stuff){

    var current = object.clone(require_view(parent).stuff) //拷贝父级页面配置
        , mod = ['tpl','pre_tpl','js','jslib','less','csslib'];
    //console.log(current);
    for(var nk in mod){
        var n = mod[nk];
        if(stuff[n]){
            if(!current[n])
                current[n] = [];
            if(!array.isArray(current[n]))
                current[n] = [current[n]];//转化为数组
            //继承连接
            current[n] = current[n].concat(stuff[n]);
        }
    }
    if(!current.inherit){
        current.inherit = [];
        //current.name = [current.name]; //转化为数组
    }
    current.inherit.push(parent); //祖先页面名称链

    //current.name.push(stuff.name); //页面名称
    return current;
};


//获取当前时间戳 秒数/毫秒
global.time = function(ms){
    var d  = new Date().getTime();
    if(ms) return d;
    else return parseInt(d/1000);
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * 同步或异步加载资源
 */
function load(dir,filename,opt,callback){

    var resource = '/'+dir+'/'
        , p1 = c_path.app+resource
        , p2 = c_path.framework+resource;
    //如果模块第一个字符为!感叹号，则默认先加载框架资源，否则先加载用户资源
    if('!'===filename.charAt(0)){
        var p = p1;
        p1 = p2;
        p2 = p; //交换顺序
        filename = filename.substr(1); //去除!符号
    }
    p1 += filename;
    p2 += filename;
    if(callback&&typeof callback=='function'){ //异步读取加载
        file.validPath([p1,p2],function(pathone){
            if(!pathone){
                var err =  'File does not exist: resource/'+filename;
                callback(err,null);
            }else{
                fs.readFile(pathone, 'utf8',function(err, data){
                    callback(err,data);
                });
            }
        });
    }else{ //同步加载读取
        var pathone = file.validPath([p1,p2]);
        if(!pathone){
            var err =  'File does not exist: resource/'+filename;
            return null; //不存在文件
        }
        return fs.readFileSync(pathone);
    }
    return true;
}

/**
 * 同步或异步加载资源
 */
function load_resource(filename,opt,callback){
    return load('resource',filename,opt,callback);
}

/**
 * 同步或异步加载资源
 */
function load_config(filename,opt,callback){
    return load('config',filename,opt,callback);
}





/**
 * 外部接口
 */
global.load = {
    ex: load,
    resource : load_resource,
    config : load_config
};



