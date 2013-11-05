

var fs = require('fs');
var UglifyJS = require_lib("uglify-js");
var file = require_tool('file');
/*js缓存文件是否存在的缓存*/
var jsFileNameCache = {};

/**
 * 合并js模块，生成js缓存文件
 * @param mop
 * @param callback
 */
exports.ready = function(mop,callback){
    var jsFileName = config.path.static+mop.jsname;
    if(jsFileNameCache[jsFileName] && !config.compiled){
        //console.log('js文件缓存');
        callback(true); /*检查读取缓存*/
        return;
    }
    fs.exists(jsFileName,function(have){
        if(config.compiled || have==false){ //编译文件
            merger(mop,function(js){
                mergerTpl(mop,function(tpl){
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
function mergerTpl(mop,callback){
    var leg = mop.tpls.length
        , name = []
        , pre_tpl = [];
    for(var i=0;i<leg;i++){ //文件名数组
        name.push(config.path.tpl+'/'+mop.tpls[i].file+'.tpl');
    }
    file.readFileList(name,false,function(err,data){
        for(var k=0;k<leg;k++){
            pre_tpl.push(mop.tpls[k].name+":'"+compress(data[k])+"'");
        }
        pre_tpl = 'Tpls={'+pre_tpl.join(',')+'};';
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
function merger(mop,callback){
    var leg = mop.js.length
        , name = [];
    for(var i=0;i<leg;i++){ //文件名数组
        name.push(config.path.js+'/'+mop.js[i]+'.js');
    }
    file.readFileList(name,function(err,data){
        if(config.compress){
            data = UglifyJS(data); //压缩js
        }
        callback(data);
    });
}
