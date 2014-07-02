

var fs = require('fs');
var UglifyJS = load.lib("!uglify-js");
var file = load.tool('!file');
var json = load.tool('!json');
var util = load.tool('!util');
var config =  load.config();
var define =  load.config('define');
var cpath =  load.config('!path');
//js库依赖关系
var cjd = define.client_js_depend;



/*js缓存文件是否存在的缓存*/
var jsFileNameCache = {};

/**
 * 合并js模块，生成js缓存文件
 * @param stuff
 * @param callback
 */
exports.ready = function(stuff,callback){
    var jsFileName = cpath.static+stuff.client_name_js;
    //console.log(jsFileName);
    if(jsFileNameCache[jsFileName] && !config.compiled){
        //console.log('js文件缓存');
        return callback(null); /*检查读取缓存*/
    }
    fs.exists(jsFileName,function(have){
        if(config.compiled || have==false){ //编译文件
            merger(stuff.js,function(err,js){
                if(err){
                    return callback(err);
                }
                mergerTpl(stuff,function(err,pretpl){
                    //console.log('js文件缓存'+pretpl);
                    if(err){
                        return callback(err);
                    }
                    fs.writeFile(jsFileName,pretpl+js, function (err) { //创建缓存文件
                        if(err){ //文件写入错误
                            return callback(err);
                        }
                        jsFileNameCache[jsFileName] = true; //缓存
                        callback(null,js+'');//处理完毕
                    });
                });
            });
        }else{
            callback(null,true);//处理完毕
        }
    });

};

/**
 * 读取tpl备用文件并合并
 */
function mergerTpl(stuff,callback){
    var pre_tpl = {};

    for(var k in stuff.tplpre){ //文件名数组
        var one = stuff.tplpre[k];
        for(var x in one){
            var path = 'tpl/'+one[x]+'.tpl'
                , tpl = read.resource(path);
            if(tpl===null){
                return callback("can't read resource : "+path)
            }
            pre_tpl[x] = compress(' '+tpl);
        }
    }


    var tplname = define.client_tpl_var || 'Tpls'
        , tplstr = 'window.'+tplname+'='+json.stringify(pre_tpl)+';'; //前端js全局变量tpls
    callback(null,tplstr);
}

//压缩tpl
function compress(tpl){
    return tpl.replace(/\s+|\n/g, " ") //压缩空格和换行
        .replace(/\s*<\s*/g, "<") //去掉< >// 括号两旁的空格
        .replace(/\s*>\s*/g, ">") //去掉< >// 括号两旁的空格
        .replace(/<\!--(\n|.)*?-->/g, ""); //去掉<!---   --->注释;
}





/**
 * 读取js文件并合并
 */
function merger(jsary,callback){
    //获取 ck 库文件依赖关系
    var deps = define.client_js_depend || {}
        , jslist = util.sortDependence(deps,jsary)
        , leg = jslist.length
        , filecontent = '';
    for(var i=0;i<leg;i++){ //文件名数组
        filecontent += read.resource('js/'+jslist[i]+'.js');
    }
    if(config.compress){
        try{
            filecontent = UglifyJS(filecontent); //压缩js
        }catch(e){
            return callback(e); //压缩错误
        }
    }
    callback(null,filecontent);
}






/**
 * ck JS 库文件依赖关系
 */
function fixCkJsDeps(jsary){
    var hasDep = [] //已经添加的依赖
        , newAry = [];
    for(var j in jsary){
        var one = jsary[j];

    }

    function getChain(js){
        if(cjd[js]){

        }

    }

    return jsary;
}















