
//返回数据统一处理器

var json = load.tool('json');

exports.text = function(req, res, context, code, head){
    //code = code || 200;
    //head = head || { 'Content-Type': 'text/html', 'Content-Encoding':'UTF-8'};
    if(code){
        res.statusCode = code;
    }
    if(head){
        for(var h in head){
            res.setHeader(h, head[h]);
        }
    }
    //res.writeHead(code, head);
    //响应时间
    //console.log('请求响应时间：'+(new Date().getTime() - req.time)+' ms');
    res.end(context+'');
};
//返回gost格式的数据
exports.api = function(req, res, data, msg, code){
    var ob = {
        code:code||200,
        msg:msg||'',
        data:data||{}
    };
    json(req, res, ob);
};


//返回json格式的字符串
var json = exports.json = function(req, res, jsonOb){
    var jsonStr = json.stringify(jsonOb);
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding':'UTF-8'});
    res.end(jsonStr);
};




