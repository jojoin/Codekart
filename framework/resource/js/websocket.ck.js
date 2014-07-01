/*
* Codekart Websocket 兼容库
* 在非原生支持 Websocket 的浏览器上 采用 http 心跳包机制
*/

C.websocket = (function(){

    /*
    系统保留的 on 消息：
    connect ：连接成功
    message ：消息到达
    error ：错误
    disconnect ：连接关闭
    reconnect ：尝试重新连接
     */

    var A = {}
        , WebSocket
        , onFunc = {}
        , enable = C.define.wspolling.enable  //启用兼容方案
        , baseurl = C.define.wspolling.baseurl
        , timeout = C.define.wspolling.timeout
        , interval = false

        ;


    // 初始化socket
    A.init = function(conf){
        //获取 ssid 及配置信息
        ajax('/'+baseurl+'/connect',function(data){

            alert(data);


            WebSocket = getWsObj();

            //浏览器不兼容 WebSocket
            if(!WebSocket){
                if(!enable){ // 不开启兼容方案
                    return eventOn('error','');
                }
                initAjaxPulling();
            }

        });
    };


    // 监听处理 socket 数据
    A.on = function(path,callback){
        if(!onFunc[path]){
            onFunc[path] = [];
        }
        onFunc[path].push(callback);
    };

    // 向服务器发送 socket 数据
    A.emit = function(path,data){

    };


    // 事件到达  转发处理
    function eventOn(path,data){
        if(path in onFunc){ // 事件已经 on 注册
            for(var i in onFunc[path]){ // 挨个调用处理程序
                onFunc[path](data);
            }
        }
    }


    //开启 ajax 轮询兼容 websocket
    function initAjaxPulling(data){

        //心跳包
        (function heartbeat(){
            ajax('/'+baseurl+'/heartbeat',function(data){
                var obj;
                try{
                    obj = C.json.parse(data);
                }catch(e){
                    console.log(e);
                    return eventOn('error','ws polling heartbeat json data parse error :'+e);
                }
                if(!obj.code || obj.code!=200){
                    return eventOn('error','ws polling heartbeat code error :'+data);
                }
                //正式解析心跳包
                eventOn(obj.on,obj);
                //无错误则继续心跳
                interval = setTimeout(heartbeat,timeout);
            });
        })();
    }


    // 获取 WebSocket 对象
    function getWsObj(){
        if ('WebSocket' in window) {
            return WebSocket;
        } else if ('MozWebSocket' in window) {
            return MozWebSocket;
        } else {
            return null;
        }
    }

    // ajax 请求
    function ajax(url,callback){
        C.ajax.send({
            url:url,
            success:callback
        });
    }




    return A;

})();