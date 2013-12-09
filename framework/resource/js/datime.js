/* *
 * 时间处理模块
 */



// JavaScript Document 时间日期处理


datime = (function(){

    var DT = {};

    DT.diff = function(publishTime){
        var timeNow = parseInt(new Date().getTime()/1000)
            ,d;
        d = timeNow - publishTime;
        if(d<0){
            return "刚刚";
        }else if(d<=60){
            return d+"秒前";
        }
        var t = function(val){return parseInt(val);};

        var oldT = new Date(publishTime*1000)
            ,newT = new Date()
            ,oYear = t(oldT.getFullYear())
            ,oMonth = t(oldT.getMonth())+1
            ,oDate = t(oldT.getDate())
            ,oHours = t(oldT.getHours())
            ,oMinutes = t(oldT.getMinutes())
            ,nYear = t(newT.getFullYear())
            ,nMonth = t(newT.getMonth())+1
            ,nDate = t(newT.getDate())
            ,nHours = t(newT.getHours())
            ,nMinutes = t(newT.getMinutes());

        if(nYear-oYear<=0){
            if(nMonth-oMonth<=0){
                if(nDate-oDate<=0){
                    if(nHours-oHours<=0){
                        return (oMinutes+"分钟前");
                    }else{
                        return (oHours+":"+oMinutes);
                    }
                    /***********************/
                }else if(nDate-oDate==1){
                    return ("昨天,"+oHours+":"+oMinutes);
                }else if(nDate-oDate==2){
                    return ("前天,"+oHours+":"+oMinutes);
                }else{
                    return (oDate+"号,"+oHours+":"+oMinutes);
                }
                /***********************/
            }else if(nMonth-oMonth==1){
                return ("上月"+oDate+","+oHours+":"+oMinutes);
            }else{
                return (oMonth+"月"+oDate+","+oHours+":"+oMinutes);
            }
            /***********************/
        }else if(nYear-oYear==1){
            return ("去年"+oMonth+"月"+oDate+","+oHours+":"+oMinutes);
        }else if(nYear-oYear==2){
            return ("前年"+oMonth+"月"+oDate+","+oHours+":"+oMinutes);
        }else{
            return (oYear+"年"+oMonth+"月"+oDate+","+oHours+":"+oMinutes);
        }

    };

    return DT;

})();



Date.prototype.format = function(format){

//使用方法
//var now = new Date();
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
//使用方法2:
//var testDate = new Date();
//var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
//alert(testStr);
//示例：
//alert(new Date().Format("yyyy年MM月dd日"));
//alert(new Date().Format("MM/dd/yyyy"));
//alert(new Date().Format("yyyyMMdd"));
//alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));

    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};


