

var callthis = load.core('server/callthis');
var object = load.tool('!object');
var json = load.tool('!json');
var config =  load.config();
var cpath =  load.config('!path');

/**
 * 获取模板页面数据
 */

//exports.ready = function(stuff,cur,request,response,callback){
exports.ready = function(viewobj,request,response,callback){
    var stuff = viewobj.stuff
        , pageData = {}
        , jsonData = {}
        , step = 0
        , leg = stuff.inherit.length + 1;
    for(var i=0;i<leg;i++){ //文件名数组
        /*
        var name = (i==leg-1)?cur:stuff.inherit[i]
            , view = load.view(name);
        if(view==null){  //页面配置文件不存在
            throw 'the view site page is not found !';
        }
        */
        var vobj = viewobj;
        if(i<leg-1){ //如果是当前页面
            try{
                vobj = load.view(stuff.inherit[i]);
            }catch(e){
                return callback(e);
            }
        }
        merger(i,vobj.data);
    }
    //获取单一数据
    function merger(index,dataFunc){
        if(dataFunc){
            try{
                var This = new callthis(request,response);
                dataFunc.call(This,function(data,jsonData){
                    ready(index,data,jsonData);
                });
            }catch(e){
                return callback(e); //调用错误
            }
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
            peData.global_obj_json_str = json.stringify(jsData);
            //console.log(reData);
            callback(null,peData);
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
    this.view =  function(path){
        view.render(this.request,this.response,path);
    };

}