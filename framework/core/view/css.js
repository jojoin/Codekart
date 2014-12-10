

var fs = require('fs');
var less  = load.lib('!less');
var file = load.tool('!file');
var array = load.tool('!array');
var config =  load.config();
var cpath =  load.config('!path');

var css_replace =  load.config('define').css_parse_replace;

/*css缓存文件是否存在的缓存*/
var cssFileNameCache = {};


/**
 * 合并css模块，生成css缓存文件
 * @param stuff
 * @param callback
 */
exports.ready = function(stuff,callback){
    var cssFileName = cpath.static+stuff.client_name_css;
    if(cssFileNameCache[cssFileName] && !config.compiled){
        //log('css文件缓存');
        return callback(null, true); /*检查读取缓存*/
    }
    fs.exists(cssFileName,function(have){
        if(config.compiled || have==false){ //编译文件
            merger(stuff,function(err,css){
                if(err){  //文件写入错误
                    if(config.debug) log(err);
                    return callback(err);
                }
                fs.writeFile(cssFileName,css, function (err) { //创建缓存文件
                    if(err){  //文件写入错误
                        return callback(err);
                    }
                    cssFileNameCache[cssFileName] = true; //缓存
                    callback(null, css);//处理完毕
                });
            });
        }else{
            cssFileNameCache[cssFileName] = true; //缓存
            callback(null, true);//处理完毕
        }
    });
};


/**
 * 生成css文件内容
 */
function merger(stuff,callback){
    var leg = stuff.less.length
        , filecontent = '';
    for(var i=0;i<leg;i++){ //文件名数组
        filecontent += read.resource('less/'+stuff.less[i]+'.less');
    }

    less.render(filecontent, function (err, css) {//生成css
        if(err){ //编译css错误
            if(config.debug) log(err);
            return callback(err);
        }
        if(config.compress.css){ //压缩css
            css = compress(css);
        }
        callback(null,pretreatment(css)); //预编译
    });
}

//预编译css
function pretreatment(css){
    if(css_replace){
        for(var c in css_replace){
            var rex = new RegExp(c,'gi');
            css = css.replace(rex, css_replace[c]);
        }
    }
    return css;
}

//压缩css
 function compress(css){
    return css.replace(/\s+|\n/g, " ") //压缩空格和换行
                   .replace(/\/\*(\n|.)*?\*\//g, "") //去掉/**/注释
                   .replace(/\s*{\s*/g, "{") //去掉{ }括号两旁的空格
                   .replace(/\s*}\s*/g, "}")
                   .replace(/\s*:\s*/g, ":") //去掉 : 冒号两旁的空格
                   .replace(/\s*;\s*/g, ";") //去掉 ; 分号两旁的空格
                   .replace(/\s*,\s*/g, ","); //去掉 , 逗号两旁的空格
}


