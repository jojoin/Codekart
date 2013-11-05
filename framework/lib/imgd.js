

/*
* 必须在linux下且安装ImageMagick后才能使用
* */


var exec  = require('child_process').exec
    , bin = '/usr/local/imagemagick/bin/'
    , identify = bin+'identify ' //获取图片信息
    , convert = bin+'convert '; //处理图片



/*
 * 缩放图片
 * ag.in = 源文件路径
 * ag.out = 处理后的图片输出路径
 * ag.p = 要缩放的比例 浮点数值
 * ag.w = 要缩放的宽度
 * ag.h = 要缩放的高度
 * ag.
 * */
 exports.resize = function(ag,callback){
     var wh = '';
     if(ag.p){
         wh = parseInt(100*ag.p)+'%';
     }else{
         wh = ag.w+'x'+ag.h;
     }
     var size = convert+ag.in+' -resize '+wh+' '+ag.out;
     exec(size,{},  function (error, stdout, stderr) {
         if(error){
             console.log('exec error: ' + error);
             return;
         }
         callback?callback():0;
     });
};




/*
* 居中截取图片指定大小
* ag.in = 源文件路径
* ag.out = 处理后的图片输出路径
* ag.w = 要截取的宽度
* ag.h = 要截取的高度
* ag.
* */
exports.cropize = function(ag,callback){

    //返回宽高
    cropize__getWH(ag,function(wh){
        cropize__size(ag,wh,function(wh){
            cropize__crop(ag,wh,function(){
                callback?callback():0;
            });
        });
    });
};

//调节图片大小
function cropize__size(ag,wh,callback){
    var rwh=0
        , i_sc = ag.w/wh.w
        , back = {}; //返回调节后的宽高
    if(ag.w/wh.w > wh.w/wh.w){ //裁剪宽高比大于原始宽高比，则以宽度为条件
        rwh = ag.w;
        back.w = ag.w;
        back.h = (ag.w/wh.w)*wh.h;
    }else{
        rwh = 'x'+ag.h;
        back.h = ag.h;
        back.w = (ag.h/wh.h)*wh.w;
    }
    var size = convert+ag.in+' -resize '+rwh+' '+ag.out;
    exec(size,{},  function (error, stdout, stderr) {
        if(error){
            console.log('exec error: ' + error);
            return;
        }
        callback(back);
    });
}

//按比例切割图片
function cropize__crop(ag,wh,callback){
    var cr = ''
        , sc = 0;
    if(ag.w<wh.w){ //去掉左右多余部分
        sc = parseInt(Math.abs(wh.w-ag.w)/2);
        cr = ag.w+'x'+ag.h+'+'+sc+'+0 ';
    }else{
        if(wh.h-ag.h<1){
            sc = 0;
        }else{
            sc = parseInt(Math.abs(wh.h-ag.h)/2);
        }
        cr = ag.w+'x'+ag.h+'+0+'+sc+' ';
    }
    var crop = convert+ag.out+' -crop '+cr+ag.out;
    exec(crop,{},  function (error, stdout, stderr) {
        if(error){
            console.log('exec error: ' + error);
            return;
        }
        callback(); //执行回调
    });
}

//获取图片的宽高
function cropize__getWH(ag,callback){
    var idfy = identify+ag.in;
    exec(idfy,{},  function (error, stdout, stderr) {
        if(error){
            console.log('exec error: ' + error);
            return;
        }
        //stdout : 123.jpg 100x100 100x100+0+0 8-bit sRGB 5.78KB 0.000u 0:00.000
        var wh = stdout.split(' ')[2].split('x')
            , w = Number(wh[0])
            , h = Number(wh[1]);
        callback({w:w,h:h}); //返回宽高
    });
}
