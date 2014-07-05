
//静态文件服务器

var path = require('path');
var fs = require('fs');
var url = require('url');
var config =  load.config();
var cpath =  load.config('!path');

//读取并返回静态文件
module.exports = function(req, res){
    //解析文件路径
    var pathname = url.parse(req.url,true).pathname
        , filePath = path.join(cpath.static+'/', pathname);
    //查看文件是否存在
    fs.exists(filePath, function(exists) {
        if(!exists) {
            res.writeHead(404, {});
            res.end('404 Not Find !');
            return;
        }
        //文件存在，读取文件
        fs.readFile(filePath, "binary", function(err, file) {
            if(err) {
                if(config.debug) log(err);
                res.writeHead(500, {});
                res.end('500 something wrong !');
                return;
            }

            var ext = path.extname(filePath);
            ext = ext ? ext.slice(1) : 'html';
            //缓存 头部信息
            if (ext.match(Expires.fileMatch)) {
                var expires = new Date();  //缓存
                expires.setTime(expires.getTime() + Expires.maxAge * 1000);
                res.setHeader("Expires", expires.toUTCString());
                res.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
            }
            var type = contentTypes[ext] || 'text/html';
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
