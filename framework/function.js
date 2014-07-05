/**
 * 全局函数
 */

var fs = require('fs');
var path = require('path');
var c_path = require('./config/path.js');
var file = require('./tool/file.js');
var array = require('./tool/array.js');
var object = require('./tool/object.js');

//成功加载过的模块名缓存
var model_name_cache = [];



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

function proload(base,name,ext,opt){
    var bname = base+'/'+name;
    //console.log(bname);
    //检查缓存，加载过路径则马上返回
    var cache = array.matchItem(model_name_cache,'name',bname);
    if(cache&&cache.path) return require(cache.path);

    //没有缓存加载新库
    var p0 = ''
        , p1 = c_path.app+'/'+base+'/'
        , p2 = c_path.framework+'/'+base+'/';
    //如果模块第一个字符为!感叹号，则默认先加载框架模块，否则加载用户模块

    var isi = ('!'==name.charAt(0));
    name = ''+name;
    if(isi){
        p0 = false; //不进行
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

    //自定义配置文件路径
    var c_p = global.load.config_path;
    if(!isi&&base=='config'&&c_p){
        p0 = c_path.app+'/config/'+c_p;
        //path_ary.unshift(p0+ext);
        //path_ary.unshift(p0+'/index'+ext);
        path_ary.unshift(p0+'/'+name+ext);
    }
    //if(p0) console.log(path_ary);
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


/**
 * 全局模块
 * @type load
 */
global.load = {
    /* 加载核心模块 */
    core: function(name,ext){
        return proload('core',name,ext);
    },
    /* 加载数据库模块 */
    db: function(name,ext){
        return proload('core/db',name,ext);
    },
    /* 加载库 */
    lib: function(name,ext){
        return proload('lib',name,ext);
    },
    /* 加载工具 */
    tool: function(name,ext){
        return proload('tool',name,ext);
    },
    /* 加载页面处理程序 */
    view: function(name,ext){
        return proload('view',name,ext,{noerror:true});
    },
    /* 配置文件路径 */
    config_path : '',
    /* 加载配置文件 */
    config: function(name,ext){
        if(!name) name = 'config'; //默认文件
        return proload('config',name,ext);
    },
    /* 加载程序模块 */
    model: function(name,ext){
        ext = suffix(ext);
        return require(c_path.model+'/'+ name+ext);
    },
    /* 加载app下处理程序 */
    app: function(name,ext){
        ext = suffix(ext);
        return require(c_path.app+'/'+name+ext);
    }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * 同步或异步加载资源
 */
function proread(dir,filename,opt,callback){

    var resource = dir?'/'+dir+'/':'/'
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
 * 读取资源
 */
global.read = {
    ex: proread, //终极
    resource: function(filename,opt,callback){
        return proread('resource',filename,opt,callback);
    },
    config: function(filename,opt,callback){
        return proread('config',filename,opt,callback);
    },
    app: function(filename,opt,callback){
        return proread('',filename,opt,callback);
    }
};




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/**
 * 打印日志
 */
//var logconf = load.config('log'); //日志配置
var logob = load.core('log'); //日志模块
global.log = function(content,opt){
    if(!opt){ // 没有配置，原生输出
        return console.log(content);
    }
    //日志模块输出
    logob.out(content,opt);
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 继承页面
 */
global.inheritView = function(parent,stuff){
    var child = object.clone(load.view(parent).stuff); //拷贝父级页面配置
    for(var c in child){
        var cn = child[c];
        if(stuff[c]){ // 增加stuff数据
            if(array.isArray(stuff[c])){
                child[c] = child[c].concat(stuff[c]);
            }else{
                child[c].push(stuff[c]);
            }
        }
    }
    child.inherit.push(parent); //祖先页面名称链
    return child;
};


/**
 * 获取当前时间戳 秒数/毫秒
 */
global.time = function(ms){
    var d  = new Date().getTime();
    if(ms) return d;
    else return parseInt(d/1000);
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 时间格式化
 */
Date.prototype.format = function(format){

//使用方法
//var now = new Date();
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
//使用方法2:
//var testDate = new Date();
//var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
//alert(testStr);
//示例：
//alert(new Date().Format("yyyy年MM月dd日"));
//alert(new Date().Format("MM/dd/yyyy"));
//alert(new Date().Format("yyyyMMdd"));
//alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));

    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};




