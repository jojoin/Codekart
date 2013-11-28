
//html文档模板

var array  = require_tool('array');
var file  = require_tool('file');
var json = require_tool("json");
var tmpl = require_tool("tmpl");
var render = require_core("render");
var css  = require_core('view/css');
var tpl  = require_core('view/tpl');
var js  = require_core('view/js');
var data  = require_core('view/data');

var tmpl_render_cache = {}; //页面解析缓存


//向客户端输出html
exports.view = function(request,response,msg){
    var name = msg.name
        , mop = require_view(name).mop
        , step = 0
        , stepTotal = 4
        , tpl_html = ''
        , tpl_data = false
        ;
    mop.jsname = '/js/'+name+'.'+config.version+'.js';
    mop.cssname = '/css/'+name+'.'+config.version+'.css';
    css.ready(mop,ready); /*编译css文件*/
    js.ready(mop,ready); /*编译js文件*/
    tpl.ready(mop,function(tpl){ /*编译tpl文件*/
        tpl_html = tpl;
        //console.log('tpl_html'+tpl);
        ready(tpl);
    });
    data.ready(mop,request,response,function(data,preData){ /*获取页面数据*/
        tpl_data = data;
        //console.log('tpl_data'+data);
        ready(data);
    });
    /*数据准备完成，开始返回*/
    function ready(data){
        if(!data){
            exports.view(request,response,{name:'error'});
            //render.text(request,response,'404');
        }else{
            step++;
        }
        if(step==stepTotal){
            var html = '';
            try{
                //html = tpl_html;
                if(!config.compiled){  //如果非debug模式
                    if(!tmpl_render_cache[name]){  //检测是否存在页面解析缓存
                        tmpl_render_cache[name] = tmpl(tpl_html); //没有则设置缓存
                    }
                    html =  tmpl_render_cache[name](tpl_data);
                }else{
                    html =  tmpl(tpl_html,tpl_data); //不缓存，每次都从头解析
                }
            }catch(e){
                //模板解析错误，返回错误页面
                //console.log('模板解析错误，返回错误页面');
                //避免循环递归错误页面
                if(msg.name=='error') render.text(request,response,'error'); //
                else exports.view(request,response,{name:'error'});
                //render.text(request,response,'error'); //
            }
            //console.log('数据解析完成，返回数据');
            //console.log(html);
            if(html) render.text(request,response,html); //
        }
    }

};
