

var fs = require('fs');
var UglifyJS = load.lib("!uglify-js");
var file = load.tool('!file');
var config =  load.config();
var cpath =  load.config('!path');



/*js缓存文件是否存在的缓存*/
var jsFileNameCache = {};

/**
 * 合并js模块，生成js缓存文件
 * @param stuff
 * @param callback
 */
exports.ready = function(stuff,callback){
    var jsFileName = cpath.static+stuff.jsname;
    if(jsFileNameCache[jsFileName] && !config.compiled){
        //console.log('js文件缓存');
        callback(true); /*检查读取缓存*/
        return;
    }
    fs.exists(jsFileName,function(have){
        if(config.compiled || have==false){ //编译文件
            merger(stuff,function(js){
                mergerTpl(stuff,function(tpl){
                    fs.writeFile(jsFileName,tpl+js, function (err) { //创建缓存文件
                        //文件写入错误
                        if(err) console.log(err);
                        jsFileNameCache[jsFileName] = true; //缓存
                        callback(js);//处理完毕
                    });
                });
            });
        }else{
            jsFileNameCache[jsFileName] = true; //缓存
            callback(true);//处理完毕
        }
    });

};

/**
 * 读取tpl备用文件并合并
 */
function mergerTpl(stuff,callback){
    var leg = stuff.tplpre.length
        , name = []
        , path = []
        , pre_tpl = [];
    for(var k in stuff.tplpre){ //文件名数组
        var one = stuff.tplpre[k];
        for(var x in one){
            name.push(x);
            path.push(cpath.tpl+'/'+one[x]+'.tpl');
            break;
        }
    }
    file.readFileList(path,false,function(err,data){
        for(var k=0;k<leg;k++){
            pre_tpl.push(name[k]+":'"+compress(data[k])+"'");
        }
        pre_tpl = 'tpl={'+pre_tpl.join(',')+'};'; //前端js全局变量tpls
        callback(pre_tpl);
    });
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
function merger(stuff,callback){
    var leg = stuff.js.length
        , filecontent = '';
    for(var i=0;i<leg;i++){ //文件名数组
        filecontent += read.resource('js/'+stuff.js[i]+'.js');
    }
    if(config.compress){
        filecontent = UglifyJS(filecontent); //压缩js
    }
    callback(filecontent);
}
