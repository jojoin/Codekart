
//静态文件服务器

var path = require('path');
var fs = require('fs');
var config =  require_config();
var cpath =  require_config('!path');

//读取并返回静态文件
exports.render = function(req, res){
    //解析文件路径
    /*
     .replace(/\/\d+/,'')  在路径前面加一串数字 ，是为了防止浏览器缓存，这里自动去掉
     */
    var filePath = path.join(cpath.static+'/', req.url.pathname.replace(/\/\d+\//,''));
    //console.log(req.url.pathname);
    //if(filePath.indexOf('.jpg')>0) console.log(filePath);
    //查看文件是否存在
    fs.exists(filePath, function(exists) {
        if(!exists) {
            //console.log('404');
            res.writeHead(404, {});
            res.end('404 Not Find !');
            return;
        }
        //文件存在，读取文件
        fs.readFile(filePath, "binary", function(err, file) {
            if(err) {
                res.writeHead(500, {});
                res.end('500 something wrong !');
                return;
            }


            var ext = path.extname(filePath);
            //console.log('文件'+ext);
            ext = ext ? ext.slice(1) : 'html';
            //缓存 头部信息
            if (ext.match(Expires.fileMatch)) {
                //console.log('缓存头'+ext);
                var expires = new Date();  //缓存
                expires.setTime(expires.getTime() + Expires.maxAge * 1000);
                res.setHeader("Expires", expires.toUTCString());
                res.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
                //console.log('可以缓存');
            }

            //console.log('服务器读取');
            var type = contentTypes[ext] || 'text/html';
            //console.log(type);
            res.writeHead(200, {'Content-Type': type});
            res.write(file, "binary");
            res.end();

        });

    });

};

var Expires = {
    fileMatch: /^(gif|png|jpg|js|css|ttf|woff|eot)$/ig, //可以缓存的文件类型
    maxAge: config.expires //缓存时间
};


var contentTypes = exports.types = {
    "js": "text/javascript",
    "css": "text/css",
    "html": "text/html",
    "gif": "image/gif",
    "png": "image/png",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "json": "application/json",
    "pdf": "application/pdf",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml",
    "gz": "application/x-gzip"
};
