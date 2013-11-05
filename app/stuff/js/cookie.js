
window.cookie = (function(){

    var CK = {};



    CK.set = function(name,value,time,path)
    {
        path = path || '/';
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + time*1000);
        document.cookie = name + "="+ value + ";expires=" + exp.toGMTString()+"; path="+path;
    };

    CK.get = function(name)//取cookies函数
    {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return arr[2]; return null;
    };

    CK.del = function(name,path)//删除cookie
    {
        path = path || '/';
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie =  name+"=; expires=" + date.toGMTString()+"; path="+path;
    };


    return CK;

})();
