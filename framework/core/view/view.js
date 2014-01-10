
//html文档模板

var array  = load.tool('array');
var file  = load.tool('file');
var json = load.tool("json");
var tmpl = load.tool("tmpl");
var render = load.core("server/render");
var css  = load.core('view/css');
var tpl  = load.core('view/tpl');
var js  = load.core('view/js');
var data  = load.core('view/data');
var config =  load.config();

var tmpl_render_cache = {}; //页面解析缓存


//向客户端输出html
exports.render = function(request,response,view,viewobject){

    if(!viewobject){
        viewobject =  load.view(view);
    }
    //不存在的页面
    if(!viewobject){
        return render404(request,response,view);
    }

    var stuff = viewobject.stuff
        , viewname = view.replace(/\//g, "_") //路径斜杠替换成下划线
        , step = 0
        , stepTotal = 4
        , tpl_html = ''
        , tpl_data = false;

    stuff.jsname = '/js/'+viewname+'.'+config.version+'.js';
    stuff.cssname = '/css/'+viewname+'.'+config.version+'.css';
    css.ready(stuff,ready); /*编译css文件*/
    js.ready(stuff,ready); /*编译js文件*/
    tpl.ready(stuff,view,function(tpl){ /*编译tpl文件*/
        tpl_html = tpl;
        //console.log('tpl_html'+tpl);
        ready(tpl,'tpl');
    });
    data.ready(stuff,view,request,response,function(data){ /*获取页面数据*/
        tpl_data = data;
        //console.log('tpl_data'+data);
        //console.log(data);
        ready(data,'data');
    });
    /*数据准备完成，开始返回*/
    function ready(data,title){
        title = title || 'css or js';
        if(!data){
            request.error_msg = 'Data acquisition error , '+title+' does not exist.';  //错误消息
            return renderError(request,response,view); //返回错误
        }else{
            step++;
        }
        if(step==stepTotal){
            var html = '';
            try{
                //console.log(tmpl);
                //html = tpl_html;
                if(!config.compiled){  //如果非debug模式
                    if(!tmpl_render_cache[viewname]){  //检测是否存在页面解析缓存
                        tmpl_render_cache[viewname] = tmpl(tpl_html); //没有则设置缓存
                    }
                    html =  tmpl_render_cache[viewname](tpl_data);
                }else{
                    html =  tmpl(tpl_html,tpl_data); //不缓存，每次都从头解析
                }
            }catch(e){
                //模板解析错误，返回错误页面
                request.error_msg = 'Template parsing error , '+e;  //错误消息
                return renderError(request,response,view);
            }
            if(html) render.text(request,response,html);
        }
    }

};


function render404(request,response,name){
    if(name=='404'){
        response.end('404 not found this page !');
    }else{
        exports.render(request,response,'404');
    }

}


function renderError(request,response,name){
    if(name=='error'){
        response.end('500 system is error !');
    }else{
        exports.render(request,response,'error');
    }

}
