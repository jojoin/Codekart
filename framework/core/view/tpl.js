
//html模板模块

//解析组合tpl文件到一个
/* *
 * 参数 @action = []
 * action[0].id = 要插入的位置id 例如<!--T--view--T-->中的view
 * action[0].file = 文件名 ./view/login/main.tpl 只需要 /login/main 即可
 *
 *
 *
 * */

var file = require_tool('file');
var json = require_tool('json');


//tpl模块出插入的位置  如果有正则字符要转义
var wrapLeft = '<!'
    , wrapRight = '!>'
    , theTplCache = {}; //tpl文件的缓存



exports.ready = function(mop,callback){
    //console.log(theTplCache);
    var name = mop.name[mop.name.length-1];
    if(theTplCache[name] && !config.compiled){ /*有缓存则读取缓存*/
        //console.log('tpl缓存');
        callback(theTplCache[name]);
        return ;
    }
    //console.log(mop.tpl);
    var leg = mop.tpl.length
        , file_list = [];
    for(var i=0;i<leg;i++){ //文件名数组
        file_list.push(config.path.tpl+'/'+mop.tpl[i].file+'.tpl');
    }

    //读取多个文件，不合并

    //console.log(file);

    file.readFileList(file_list,{merger:false},function(err,data){
        //console.log('tpl'+data);
        var tplEx = addReferenceFile(mop,data);
        merger(name,tplEx,callback);
    });
};


//扩展js和css文件的引用
function addReferenceFile(mop,data){
    var tplEx = {}
        , leg = mop.tpl.length;
    for(var k=0;k<leg;k++){
        var id = mop.tpl[k].id || k;
        tplEx[id] = data[k] || '';
    }
    //添加js和css引用
    tplEx['src_style'] = '<link rel="stylesheet" type="text/css" href="'+mop.cssname+'" />';
    var script = '';
    for(var js in mop.jslib){
        script += '<script type="text/javascript" src="/jslib/'+mop.jslib[js]+'.js"></script>';
    }
    script += '<script type="text/javascript" src="'+mop.jsname+'" ></script>';
    tplEx['src_script'] = script;
    return tplEx;
}



//正则替换合并
function merger(name,tplEx,callback){
    var  content = '';
    for(var k in tplEx){
        var one = tplEx[k];
        if(k=='0'){ /*html根节点*/
            content += one;
        }else{
            var Tstr = wrapLeft+k+wrapRight
                , rex = new RegExp(Tstr);
            content = content.replace(rex,one+Tstr);
        }
    }
    if(config.compress){ /* 压缩文件 */
        content = compress(content);
    }
    //console.log(content);
    /* 缓存模板内容 */
    theTplCache[name] = content;
    //console.log('tpl文件'+content);
    callback(content);
}


//压缩tpl
function compress(tpl){
    return tpl.replace(/\s+|\n/g, " ") //压缩空格和换行
                 .replace(/\s*<\s*/g, "<") //去掉< >// 括号两旁的空格
                 .replace(/\s*>\s*/g, ">") //去掉< >// 括号两旁的空格
                 .replace(/<\!--(\n|.)*?-->/g, ""); //去掉<!---   --->注释;
}


