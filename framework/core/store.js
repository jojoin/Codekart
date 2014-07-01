
var fs = require('fs');

var config = load.config('log');
var conpath = load.config('!path');

var json = load.tool('!json');


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



