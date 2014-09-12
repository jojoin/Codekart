
var crypto = require('crypto');


/**
 * 判断是否为字符串  返回true或false
 */
exports.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};




/* *
 * 生成MD5值
 * */
exports.md5 = function(str){
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
};


/* *
 * 验证字符串是否为email格式
 * */
exports.isEmail = function(mail){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return !!filter.test(mail);
};



/* *
 * 加密解密字符串
 * */
//26+26+10=62-1=61，字符串加密
var keycode = 'MnbHYcv52ur3AZak106xGBhVgJUsjd4Fq987LRytTEoDCpOPNwzXSWmfIKieQ';
var keyxchar = 'l';
exports.encrypt = function(str){
    var leg = str.length
        ,xAry = keycode.split('')
        ,fixStr = [];
    for(var i=0;i<leg;i++){
        var a = str.charCodeAt(i)
            ,str_i = ''
            ,pro = 100
            ,ary = [];
        for(var k=0;k<pro;k++)
        {
            if(k>0){
                a=(a-ary[k-1])/60;
            }
            ary[k] = a%60;
            if(0==a){ break; }
            str_i += xAry[a%60];
        }
        //console.log(str[i]+'-'+a+'-'+str_i);
        fixStr.push(str_i);
    }
    //console.log(fixStr.join(keyxchar));
    return fixStr.join(keyxchar);
};


//解密
exports.decrypt = function(instr){
    var strary = instr.split(keyxchar)
        ,leg = strary.length
        ,str = '';
    for(var i=0;i<leg;i++)
    {
        var strMx = 0
            ,fixStr_i = strary[i]
            ,pro = fixStr_i.length;
        for(var k=0;k<pro;k++)
        {
            var cstr_k = fixStr_i[k]
                ,a = keycode.indexOf(cstr_k);
            strMx += a * Math.pow(60,k);
        }
        str += String.fromCharCode(strMx);
    }
    return str;
};

