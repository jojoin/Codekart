/**
* api 接口请求
*/
C.api = function(url,get,post,callback,errorback){

    //gost_loading.show();

    if(post!=null){
        var geturl = '';
        for(var p in get){
            geturl += p+'='+get[p]+'&';
        }
        url += '?' + geturl.substring(0,geturl.length-1);//去掉末尾的 & 字符
        C.ajax.post(url,post,function(err,DATA){
            if(err){
                return errorback?errorback():0;
            }
            dealBackData(DATA,callback,errorback);
        },'html');
    }else{ //没有post参数
        C.ajax.get(url,get,function(err,DATA){
            if(err){
                return errorback?errorback():0;
            }
            dealBackData(DATA,callback,errorback);
        },'html');
    }

    //处理接口返回的数据
    function dealBackData(DATA,callback,errorback){
        eval(' var JsonOb = '+DATA+';');
        //{"code":"","msg":"","data":[]}
        if(JsonOb.code==200){
            callback?callback(JsonOb):0;//正常状态调用回调
        }else{
            errorback?errorback(JsonOb):0; //错误处理
        }
    }
};