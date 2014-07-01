
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
exports.render = function(request,response,viewpath){
    if(!viewpath){
        return render404(request,response);
    }

    var viewobj = load.view(viewpath);

    //console.log(viewobj);

    var stuff = viewobj.stuff
        , viewname = viewpath.replace(/\//g, "_"); //路径斜杠替换成下划线

    //客户端文件名
    stuff.client_name_js = '/js/'+viewname+'.'+config.version+'.js';
    stuff.client_name_css = '/css/'+viewname+'.'+config.version+'.css';

    var data_css
        , data_js
        , data_tpl
        , data_data;

    //编译合并压缩 css 文件
    css.ready(stuff,function(err,data){
        //console.log(data);
        data_css = data;
        doRender(err);
    });

    //编译合并压缩 js 文件
    js.ready(stuff,function(err,data){
        //console.log(err);
        //console.log(data);
        data_js = data;
        doRender(err);
    });

    //编译合并压缩 tpl 文件
    tpl.ready(stuff,viewpath,function(err,data){
        //console.log(data);
        data_tpl = data;
        doRender(err);
    });

    //获得 tpl 数据
    data.ready(viewobj,request,response,function(err,data){
        //console.log(data);
        data_data = data;
        doRender(err);
    });


    //数据准备完毕  开始正式输出
    function doRender(err){
        //如果解析错误
        if(err){
            request.error_msg = err;
            renderError(request,response);
            return false;
        }
        //验证数据是否准备完毕
        if(data_data===undefined
            ||data_tpl===undefined
            ||data_js===undefined
            ||data_css===undefined
            ){
            //console.log('return false;');
            return false;
        }

        //console.log('正式开始解析');

        //正式开始解析
        var html = '';
        try{
            //console.log(tpl_html);
            //html = tpl_html;
            if(!config.compiled){  //如果非debug模式
                if(!tmpl_render_cache[viewname]){  //检测是否存在页面解析缓存
                    tmpl_render_cache[viewname] = tmpl(data_tpl); //没有则设置缓存
                }
                html =  tmpl_render_cache[viewname](data_data);
            }else{
                //console.log(data_data);
                html =  tmpl(data_tpl,data_data); //不缓存，每次都从头解析
            }
        }catch(e){
            //console.log(e);
            //模板解析错误，返回错误页面
            request.error_msg = 'Template parsing error : '+e;  //错误消息
            return renderError(request,response,viewname);
        }
        //正式返回客户端
        if(html){
            render.text(request, response, html);
        }
    }

};



//向客户端输出html
exports.render_old = function(request,response,view,viewobject){

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
        //console.log('tpl_html : '+tpl);
        ready(tpl,'tpl');
    });
    data.ready(stuff,view,request,response,function(data){ /*获取页面数据*/
        tpl_data = data;
        //console.log('tpl_data : '+data);
        //console.log(data);
        ready(data,'data');
    });
    /*数据准备完成，开始返回*/
    function ready(data,title){
        title = title || 'css or js';
        if(!data){
            request.error_msg = 'Data acquisition error , '+title+' does not exist.';  //错误消息
            //return renderError(request,response,view); //返回错误
        }else{
            step++;
        }
        if(step==stepTotal){
            var html = '';
            try{
                //console.log(tpl_html);
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
                return renderError(request,response,viewname);
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
        response.end('500 system error !');
    }else{
        exports.render(request,response,'error');
    }

}
