
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


//向客户端输出html
exports.view = function(request,response,msg){
    var mop = require_view(msg.name).mop
        , step = 0
        , stepTotal = 4
        , tpl_html = ''
        , tpl_data = false;
    mop.jsname = '/js/'+msg.name+'.'+config.version+'.js';
    mop.cssname = '/css/'+msg.name+'.'+config.version+'.css';
    css.ready(mop,ready); /*编译css文件*/
    js.ready(mop,ready); /*编译js文件*/
    tpl.ready(mop,function(tpl){ /*编译tpl文件*/
        tpl_html = tpl;
        ready(tpl);
    });
    data.ready(mop,request,response,function(data,preData){ /*获取页面数据*/
        tpl_data = data;
        ready(data);
    });
    /*数据准备完成，开始返回*/
    function ready(data){
        if(!data){
            if(msg.name=='404') render.text(request,response,'404'); //
            else exports.view(request,response,{name:'404'});
            //render.text(request,response,'404');
        }else{
            step++;
        }
        if(step==stepTotal){
            var html = '';
            try{
                //html = tpl_html;
                html =  tmpl.parse(tpl_html,tpl_data);
            }catch(e){
                //模板解析错误，返回错误页面
                //console.log('模板解析错误，返回错误页面');
                //避免循环错误页面
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
