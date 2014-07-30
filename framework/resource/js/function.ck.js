


//通过id获取dom对象
function $id(id) {
    return document.getElementById(id);
}


//打印js对象
function dumpObj(myObject) {
    var s = "";
    for (var property in myObject) {
        s = s + "\n "+property +": " + myObject[property] ;
    }
    return s;
}

//验证电子邮箱地址
function testEmail(mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(filter.test(mail)) return true;
    else return false;
}


//获取一个数组之中某项的某个属性为多少的项
function aryMatchItem(ary,name,item){
    var leg = ary.length;
    for(var i=0;i<leg;i++){
        if(item == ary[i][name]){
            return ary[i];
        }
    }
    return null;
}


//数组去重
function aryUnique(ary)
{
    var n = {},r=[]; //n为hash表，r为临时数组
    for(var i = 0; i < ary.length; i++) //遍历当前数组
    {
        if (!n[ary[i]]) //如果hash表中没有当前项
        {
            n[ary[i]] = true; //存入hash表
            r.push(ary[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}





function  ScollPostion() {//滚动条位置
    var t, l, w, h, cw, ch;
    var documentElement = document.documentElement;
    var documentBody = document.body;
    if (documentElement && documentElement.scrollTop) {
        t = documentElement.scrollTop;
        l = documentElement.scrollLeft;
        w = documentElement.scrollWidth;
        h = documentElement.scrollHeight;
    } else if (documentBody) {
        t = documentBody.scrollTop;
        l = documentBody.scrollLeft;
        w = documentBody.scrollWidth;
        h = documentBody.scrollHeight;
    }

    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var doClientWidth = documentBody.clientWidth;
    var doClientHeight = documentBody.clientHeight;
    var enClientWidth = documentElement.clientWidth;
    var enClientHeight = documentElement.clientHeight;

    //获取窗口宽度
    if (innerWidth)
        cw = innerWidth;
    else if ((documentBody) && (doClientWidth))
        cw = doClientWidth;
    //获取窗口高度
    if (innerHeight)
        ch = innerHeight;
    else if ((documentBody) && (doClientHeight))
        ch = doClientHeight;

    //通过深入Document内部对body进行检测，获取窗口大小
    if (documentElement  && enClientHeight &&
        enClientWidth)
    {
        ch = enClientHeight;
        cw = enClientWidth;
    }


    return { top:t, left:l, width:w, height:h, clientWidth:cw ,clientHeight:ch };
}

