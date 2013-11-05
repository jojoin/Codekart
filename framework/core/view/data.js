

var object = require_tool('object');
var json = require_tool('json');

/**
 * 获取模板页面数据
 */

exports.ready = function(mop,request,response,callback){
    var dataAry = []
        , step = 0
        , leg = mop.name.length;
    for(var i=0;i<leg;i++){ //文件名数组
        var name = mop.name[i]
            , pageData = require_view(name).data
            , preData = {};
        merger(i,pageData);
    }
    //获取单一数据
    function merger(index,pageData){
        if(pageData){
            var This = new pageDataThis(request,response);
            pageData.call(This,function(data,preData){
                ready(index,data,preData);
            });
        }else{
            ready(index,{})
        }
    }
    //数据获取完成
    function ready(index,data,pdata){
        dataAry[index] = data;
        //console.log(dataAry);
        if(pdata){ //准备的数据
            object.extend(preData,pdata,true);
        }
        step++;
        if(step==leg){ /*数据准备完成开始合并*/
            var reData = {};
            for(var i=0;i<leg;i++){
                object.extend(reData,dataAry[i],true);
            }
            reData.global = json.stringify(preData);
            //console.log(reData);
            callback(reData);
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
    //返回跳转页面
    this.renderJump =  function(url){
        url = url || '/';
        this.render('<script type="text/javascript">window.location.href="'+url+'"</script>');
    };
}