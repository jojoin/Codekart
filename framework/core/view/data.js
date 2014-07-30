

var callthis = load.core('!server/callthis');
var object = load.tool('!object');
var json = load.tool('!json');
var config =  load.config();
var cpath =  load.config('!path');

/**
 * 获取模板页面数据
 */


/**
 * 获取模板数据
 */

exports.ready = function(viewobj,request,response,callback){

    var DATA = {}   // 页面数据
        , predataFunc = []
        , dataFunc = []
        , aftdataFunc = []
        , stuff = viewobj.stuff
        , leg = stuff.inherit.length;
    //log(stuff.inherit); //打印继承链
    for(var i=0;i<leg+1;i++) { // 遍历继承链
        var vobj;
        if(i==leg){ // 当前页面
            vobj = viewobj;
        }else{ // 父级页面
            try{
                vobj = load.view(stuff.inherit[i]);
            }catch(e){

                return callback(e);
            }
        }
        if(vobj.data){
            dataFunc.push(vobj.data);
        }
        if(vobj.predata){
            predataFunc.push(vobj.predata);
        }
        if(vobj.aftdata){
            aftdataFunc.push(vobj.aftdata);
        }
    }

    //开始运行处理函数 3步
    callFunc(predataFunc,true,function(){
        callFunc(dataFunc,false,function(){ //并发执行
            callFunc(aftdataFunc,true,function(){
                //返回最终的数据结果
                callback(null,DATA);
            });
        });
    });


    /**
     * @param funcs 函数数组
     * @param sync  是否线性调用
     */
    function callFunc(funcs,sync,back){

        if(sync){ //如果是线性执行
            var leg = funcs.length
                , l = -1;
            (function step(){
                l++;
                if(l==leg){
                    return back();  //完成调用  回调
                }
                callOne(funcs[l],step);
            })();
        }else{ // 并发执行
            var leg = funcs.length
                , l = 0;
            for(var f in funcs){
                callOne(funcs[f],function(){
                    l++;
                    if(leg==l){
                        back(); //完成调用  回调
                    }
                })
            }


        }


    }


    // 执行一次函数调用
    function callOne(func,back){
        try{
            var This = new callthis(request,response);
            func.call(This,function(data){
                if(data==false){
                    callback(null,false); //中断data获取函数
                }else{
                    object.extend(DATA,data,true);
                    back(data);
                }
            },DATA);
        }catch(err){
            if (config.debug) log(err);
            callback(err); //错误回调
        }
    }

};













/*




//exports.ready = function(stuff,cur,request,response,callback){
exports.ready = function(viewobj,request,response,callback){
    var stuff = viewobj.stuff
        , pageData = {}
        , jsonData = {}
        , step = 0
        , leg = stuff.inherit.length + 1;
    for(var i=0;i<leg;i++){ //文件名数组
        var vobj = viewobj;
        if(i<leg-1){ //如果是当前页面
            try{
                vobj = load.view(stuff.inherit[i]);
            }catch(e){
                if(config.debug) log(e);
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
                if(config.debug) log(e);
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
        if(step==leg){ //数据准备完成开始合并
            var peData = {}
                , jsData = {};
            for(var i=0;i<leg;i++){
                object.extend(peData,pageData[i],true);
                object.extend(jsData,jsonData[i],true);
            }
            peData.global_obj_json_str = json.stringify(jsData);
            //log(reData);
            callback(null,peData);
        }
    }
};

*/