

/* *
 * 加密解密字符串类
 * */

window.cryption = (function(){
    //26+26+10=62-1=61，字符串加密，keycode，keyxchar不能改变！！！
    var keycode = 'MnbHYcv52ur3AZak106xGBhVgJUsjd4Fq987LRytTEoDCpOPNwzXSWmfIKieQ'
        ,keyxchar = 'l'
        ,CP = {};
    //加密
    CP.enc = function(str){
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
                if(0==a%60){ break; }
                str_i += xAry[a%60];
            }
            fixStr.push(str_i);
        }
        return fixStr.join(keyxchar);
    };
    //解密
    CP.dec = function(instr){
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
})();