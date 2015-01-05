


//通过id获取dom对象
function $id(id) {
    return document.getElementById(id);
}


//打印js对象
function dumpObj(myObject) {
    var s = "";
    for (var property in myObject) {
        s = s + "\n "+property +": " + myObject[property] ;
    }
    return s;
}

//验证电子邮箱地址
function testEmail(mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(filter.test(mail)) return true;
    else return false;
}


//获取一个数组之中某项的某个属性为多少的项
function aryMatchItem(ary,name,item){
    var leg = ary.length;
    for(var i=0;i<leg;i++){
        if(item == ary[i][name]){
            return ary[i];
        }
    }
    return null;
}


//数组去重
function aryUnique(ary)
{
    var n = {},r=[]; //n为hash表，r为临时数组
    for(var i = 0; i < ary.length; i++) //遍历当前数组
    {
        if (!n[ary[i]]) //如果hash表中没有当前项
        {
            n[ary[i]] = true; //存入hash表
            r.push(ary[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}


// 解析URL：http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).
/*
var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
myURL.file;     // = 'index.html'
myURL.hash;     // = 'top'
myURL.host;     // = 'abc.com'
myURL.query;    // = '?id=255&m=hello'
myURL.param;   // = { id: 255, m: hello }
myURL.path;     // = '/dir/index.html'
myURL.segment; // = ['dir', 'index.html']
myURL.port;     // = '8080'
myURL.protocol; // = 'http'
myURL.url;   // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
*/
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        url: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        param: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segment: a.pathname.replace(/^\//,'').split('/')
    };
}