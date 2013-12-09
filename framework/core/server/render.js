
//返回数据统一处理器

var json = require_tool('json');

exports.text = function(req, res, context){
    var output = context+'';
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Encoding':'UTF-8'
    });
    //响应时间
    //console.log('请求响应时间：'+(new Date().getTime() - req.time)+' ms');
    res.end(output);
};
//返回gost格式的数据
exports.api = function(req, res, code,msg,data){
    var ob = {
        code:code,
        msg:msg,
        data:data
    };
    renderJson(req, res, ob);
};

//返回json格式的字符串
var renderJson = exports.json = function(req, res, jsonOb){
    var jsonStr = json.stringify(jsonOb);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(jsonStr);
};
