/**
 * 全局日志支持
 */


var fs = require('fs');

var config = load.config('log');
var conpath = load.config('!path');

var json = load.tool('!json');

//配置缓存
var type_config = [];

/**
 * 默认保留的消息种类
 */
var reserved_type = exports.reserved_type = [
    'fatal',
    'error',
    'warning',
    'notice',
    'info',
    'debug'  // 5 默认消息类型
];




function fixtype(type){
    if(parseInt(type)>=0){
        type = reserved_type[type];
    }
    return type;
}


function logfilepath(key){
    return conpath.log+'/'+key+'.log';
}

function storefilepath(key){
    return conpath.log+'/'+key+'.store';
}


/**
 * 打印日志到标准输出
 */
var out = exports.out = function(type,opt,content){

    if(!opt){
        content = type;
        type = 'debug'; //默认
        opt = {};
    }else if(!content){
        content = opt;
        opt = {};
    }

    type = fixtype(type);

    if(!allow_log(type,opt)) return;

    var time = '';

     //获取分别配置
     var conf = get_type_config(type);

    //输出头部
    if(conf.wrap_before){
        time = new Date().format('yyyy-MM-dd hh:mm:ss');
        var be = conf.wrap_before.replace(/\${type}/ig,type).replace(/\${time}/ig,time);
        content = be + content;
    }
    //输出尾部
    if(conf.wrap_after){
        if(!time) time = new Date().format('yyyy-MM-dd hh:mm:ss');
        var af = conf.wrap_after.replace(/\${type}/ig,type).replace(/\${time}/ig,time);
        content = content + af;
    }

    //输出正文到文件
    if(conf.out_file){
        fs.appendFile(logfilepath(conf.out_file),content+'\n','utf8',function(err){
            if(err) console.log(err);
        });
        return;
    }

    //输出正文到标准输出
    console.log(content);
};


/**
 * 获得类型分别的配置
 */

function get_type_config(type){
    if(!type_config[type]){
        type_config[type] = {};
        var wrap_before = config[type]?config[type].wrap_before:false;
        type_config[type].wrap_before = wrap_before?wrap_before:config.wrap_before;
        var wrap_after = config[type]?config[type].wrap_after:false;
        type_config[type].wrap_after = wrap_after?wrap_after:config.wrap_after;
        var output_file = config[type]?config[type].output_file:false;
        type_config[type].output_file = output_file?output_file:config.output_file;
    }
    return type_config[type];
}



/**
 * 打印当前时间到标准输出
 */
var time = exports.time = function(format){
    format = format || 'yyyy-MM-dd hh:mm:ss';
    console.log(new Date().format(format));
};



/**
 * 是否允许输出日志
 */
function allow_log(type,opt){
    if(config.not_allow.indexOf(type)>-1){
        return false; //黑名单优先级高
    }
    if(config.allow&&config.allow.indexOf(type)>-1){ //白名单
        return true;
    }
    if(config.allow&&config.allow.indexOf(type)==-1){ //白名单
        return false;
    }
    return true; //允许全部
}






/**
 * 保存与记录日志数据
 */


//日志内存缓存
var STORE = {};

//设置和获取日志
exports.store = function(key,value){
    if(!value) return store_get_sync(key);
    if(typeof value=='function') return store_get(key,value);
    return store_set(key,value);
};


//[同步]读取保存的数据
function store_get_sync(key){
    var file = storefilepath(key);
    //如果开启日志缓存
    if(config.store_cache && STORE[key]){
        return STORE[key];
    }
    //尝试读取
    var filestr = null;
    try{
        filestr = fs.readFileSync(file,{encoding:'utf8'});
    }catch(e){
        out(1,'read '+file+' error !');
    }
    var fileob = store_fixjson(filestr);
    //缓存到内存
    if(config.store_cache && !STORE[key] &&fileob){
        STORE[key] = fileob;
    }
    //返回数据
    return fileob;

}

//如果为json数据 则自动解析
function store_fixjson(str){
    var fileob;
    try{
        fileob = json.parse(str);
    }catch(e){}
    if(fileob) return fileob;
    return str;
}



//[异步]读取保存的数据
function store_get(key,func){
    var file = storefilepath(key);
    //如果开启日志缓存
    if(config.store_cache && STORE[key]){
        return func(STORE[key]);
    }
    //尝试读取
    fs.readFile(file, function (err, data) {
        if(err){
            out(1,'read '+file+' error !');
            return func(null);
        }
        var fileob = store_fixjson(data);
        //缓存到内存
        if(config.store_cache && !STORE[key] && fileob){
            STORE[key] = fileob;
        }
        func(fileob);
    });

}


//保存日志数据
function store_set(key,value){

    //如果开启日志缓存
    if(config.store_cache){
        STORE[key] = value;
    }
    //日志写入磁盘
    fs.writeFile(storefilepath(key),json.stringify(value),{encoding:'utf8'});
}














