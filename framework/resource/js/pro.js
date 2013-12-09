

//全站服务模块

window.pro = (function(json,cookie){

    var PO = {}
        ,urlBase = '/api/'
        ,debug = false; //是否为调试模式

    //调用后台接口 获取数据
    PO.api = function(name,get,post,callback,errorback){
        //gost_loading.show();
        name = urlBase+name;//加上url
        var upcode = new Date().getTime()
            ,gets = {v_u_p:upcode};

        if(get!=null){
            gets = $.extend(gets,get);
        }
        if(post!=null){
            var geturl = '';
            for(var p in gets){
                geturl += p+'='+gets[p]+'&';
            }
            name += '?' + geturl.substring(0,geturl.length-1);//去掉末尾的 & 字符
            $.post(name,post,function(DATA){
                dealBackData(DATA,callback,name,errorback);
            },'html');
        }else{ //没有post参数
            $.get(name,gets,function(DATA){
                dealBackData(DATA,callback,name,errorback);
            },'html');
        }
    };


    //处理接口返回的数据
    function dealBackData(DATA,callback,url,errorback){
       eval(' var JsonOb = '+DATA+';');
        //{"code":"","msg":"","data":[]}
        if(JsonOb.code==200){
            callback(JsonOb.data);//正常状态调用回调
        }else{
            if(debug){
                $('body').prepend(JsonOb.msg+'，请求：'+url+'<br/>');
            }
            if(errorback) errorback(JsonOb); //错误处理
            //alert('返回状态出错！');
        }
        //gost_loading.hide();
        return JsonOb.msg;
    }



    //数据库转义恢复
    PO.ds = function(str){
        return str.replace(/\\'/g,"'")
            .replace(/\\"/g,'"');
    };


    //获取网页gets参数和#哈希参数
    PO.gets = GetRequest(location.search,'?');
    PO.hash = GetRequest(location.hash,'#');
    function GetRequest(url_str,cx) {
        var theRequest = []
            , leg = 0;
        if (url_str.indexOf(cx) != -1) {
            var str = url_str.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                var key = strs[i].split("=")[0]
                    , value = strs[i].split("=")[1];
                if(value){
                    leg++; //有参数
                    theRequest[key]=unescape(value);
                }
            }
        }
        return leg>0?theRequest:(url_str.replace(cx,''));
    }

    return PO;

})(json,cookie);