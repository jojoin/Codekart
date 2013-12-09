
//对页面标题的操作


title = (function(){

    var TL = {}
		, right_t = ' - 君鉴';

    TL.set =  function(title,isall){
        if(true==isall){ //获取全部的标题内容
            document.title =  title;
        }else{
            var num = TL.getNum();
            document.title = title+right_t;
        }
    };

    TL.get = function(isall){
        var title = document.title;
        if(true==isall){ //获取全部的标题内容
            return title;
        }
        //仅获取正文部分 去除如 [2] 前缀数字和 -君鉴 后缀
        return title.replace(/\[(\n|.)*?\]/,"")
                      .replace(/\-.*/,"");
    };
    //alert('[32465]aslakgj阿斯钢奥利坎多-君鉴'.replace(/\[(\n|.)*?\]/,"").replace(/-.*/,""));


    TL.setNum = function(num){
        var ta = TL.get();
        TL.set('['+num+']'+ta+right_t,true);
    };


    TL.getNum = function(){
        var title = TL.get(true)
            ,num = title.replace(/\[([\s\S]*)\][\s\S]*$/ig, "$1");
        //alert(num);
        if(false==parseInt(num)){
            return 0;
        }
        return parseInt(num);
    };


    TL.addNum = function(num){
        var nu = TL.getNum()
            ,tl = TL.get()
            ,nuw = nu+parseInt(num);

        nuw>0?tl='['+nuw+']'+tl:0;
        tl+=right_t;

        TL.set(tl,true);

    };


    TL.reduceNum = function(num){
        var nu = TL.getNum()
            ,tl = TL.get()
            ,nuw = nu-parseInt(num);

        nuw>0?tl='['+nuw+']'+tl:0;
        tl+=right_t;

        TL.set(tl,true);
    };






    return TL;

})();