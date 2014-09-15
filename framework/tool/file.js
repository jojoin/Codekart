
/**
 * 文件处理辅助类
 * */

var fs = require('fs');
var path = require('path');

var array = require('./array');

/**
 * 返回一条可用的文件路径
 * @param path          路径或路径数组
 * @param callback   回掉，如果不指定则为同步版本
 */
exports.validPath = function(path,callback){
    if(callback && typeof callback=='function'){
        valid_path(path,callback);
        return false;
    }else{
        return  valid_path_sync(path);
    }
};
function valid_path_sync(path){ //同步版本
    if(typeof path=='string'){
        var is = fs.existsSync(path);
        return is?path:null;
    }
    for(var k in path){
        if(fs.existsSync(path[k])){
            return path[k];
        }
    }
    return null;
}
function valid_path(path,callback){ //异步
    var str = typeof path=='string'
        , i = 0
        , leg = path.length;
    //查找函数
    function seek(path){
        fs.exists(path, function (exists) {
            if(exists){
                callback(path);
            }else{
                if(str){ //单独路径
                    callback(null);
                }else{
                    var other =  next();
                    if(other) seek(other);
                    else{
                        callback(null);
                    }
                }
            }
        });
    }
    //下一个路径
    function next(){
        var pat = null;
        if(i<leg) pat = path[i];
        i++;
        return pat;
    }
    //开始查找
    if(str){
        seek(path);
    }else{
        seek(next());
    }
}


/* *
 * 按文件名数组读取文件并按顺序合并
 * @nameAry 文件名数组
 * @callback 回调函数，参数(err,data)
 * @option.merger = true 是否合并文件
 * */
exports.readFileList = function(nameAry,merger,callback){
    if(!array.isArray(nameAry) || 0==nameAry.length){
        if(true==merger){
            callback(true,'');
        }else{
            callback(true,[]); //返回数组
        }
        return false;
    }
    if(typeof(merger)=='function'){
        callback = merger;
        merger = true; //是否合并
    }
    var leg = nameAry.length
        ,fileCon = []  //读取的单文件内容数组
        ,hasNum = 0; //已经读取的文件数量统计
    fileCon.length = leg; //保证与item的顺序相同
    for(var i=0;i<leg;i++){
        read(i);
    }
    //读取文件
    function read(k){
        fs.readFile(nameAry[k], 'utf8',function(err, data){
            if( err ) throw err;
            hasNum++;
            fileCon[k] = data;
            if(hasNum==leg){ //已经读完
                if(true==merger){
                    var content = '';
                    for(var j=0;j<leg;j++){ //合并文件
                        content += fileCon[j]
                    }
                    callback(err,content);
                }else{
                    //console.log(fileCon);
                    callback(err,fileCon); //返回数组
                }
            }
        });
    }
};





/**
 * 创建多层文件夹（同步）
 */
var mkdirsSync = exports.mkdirsSync = function(dirpath, mode) { 
    var exists = fs.existsSync(dirpath);
    if(exists){
        return true
    } else {
        //尝试创建父目录，然后再创建当前目录
        mkdirsSync(path.dirname(dirpath), mode);
        return fs.mkdirSync(dirpath, mode);
    }
}



/**
 * 创建多层文件夹（异步）
 */
var mkdirs = exports.mkdirs = function(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback(dirpath);
        } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), mode, function(){
                        fs.mkdir(dirpath, mode, callback);
                });
        }
    });
};
