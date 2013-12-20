

var object = require_tool('!object');
var json = require_tool('!json');
var config =  require_config();
var cpath =  require_config('!path');

/**
 * 获取模板页面数据
 */

exports.ready = function(stuff,cur,request,response,callback){
    var pageData = {}
        , jsonData = {}
        , step = 0
        , leg = stuff.inherit.length + 1;
    for(var i=0;i<leg;i++){ //文件名数组
        var name = (i==leg-1)?cur:stuff.inherit[i]
            , view = require_view(name);
        if(view==null){  //页面配置文件不存在
            throw 'the view site page is not found !';
        }
        merger(i,view.data);
    }
    //获取单一数据
    function merger(index,dataFunc){
        if(dataFunc){
            var This = new pageDataThis(request,response);
            dataFunc.call(This,function(data,jsonData){
                ready(index,data,jsonData);
            });
        }else{
            ready(index)
        }
    }
    //数据获取完成
    function ready(index,data,jsda){
        pageData[index] = data;
        jsonData[index] = jsda;
        step++;
        if(step==leg){ /*数据准备完成开始合并*/
            var peData = {}
                , jsData = {};
            for(var i=0;i<leg;i++){
                object.extend(peData,pageData[i],true);
                object.extend(jsData,jsonData[i],true);
            }
            peData.json_str = json.stringify(jsData);
            //console.log(reData);
            callback(peData);
        }
    }
};


function pageDataThis(request,response){
//返回内容
    this.request = request;
    this.response = response;
    this.render = function(context){
        var output = context+'';
        this.response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8' });
        this.response.end(output);
    };
    this.render302 = function(url){
        var output = context+'';
        this.response.writeHead(302, { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8',
            Location:url});
        this.response.end(output);
    };
    //返回跳转页面
    this.renderJump =  function(url){
        url = url || '/';
        this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
    };
    //重定向视图
    this.view =  function(name){
        view.view(this.request,this.response,{name:name});
    };

}