
//文件上传模块

var formidable = require('formidable');
var config = load.config();
var path = load.config('!path');



exports.get = function(req,callback){


    var form = new formidable.IncomingForm();
    form.uploadDir = path.tmp; //临时文件夹

    form.parse(req, function(err, fields, files) {

        if(err){
            console.log(err);
            callback?callback(false):0;
            return;
        }
        //console.log(fields);
        //console.log(files);
        callback?callback(files.upload):0;
    });
};

