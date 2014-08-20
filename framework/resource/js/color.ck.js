/**
 * color 颜色处理
 */
C.color = (function(){

    var A = {};



    /**
     * 将color值rgb转化为16进制
     * rgb 为逗号隔开的三位数  126,235,160 或 rgb(126,235,160)
     */
    A.rgb2hex = function(rgb){
        var re = rgb.replace(/[^0-9|,]*/g,'').split(",");//利用正则表达式去掉多余的部分
        var hexColor = "#";
        var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < 3; i++) {
            var r = null;
            var c = re[i];
            var hexAr = [];
            while (c > 16) {
                r = c % 16;
                c = (c / 16) >> 0;
                hexAr.push(hex[r]);
            }
            hexAr.push(hex[c]);
            hexColor += hexAr.reverse().join('');
        }
        //alert(hexColor)
        return hexColor;
    };


    return A;

})();
