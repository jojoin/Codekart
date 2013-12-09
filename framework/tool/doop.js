
/*
 * 定时在指定时间执行代码的工具
 */


var object  = require_tool('object');



/*
 * 默认配置
 */


/*
 * 外部接口
 */
exports.doop = function(option,callback){
    var opt = {
        time: '',                        //执行时间 24小时制   10:10:10   默认为当前
        loop: 0,                       //执行次数  0表示执行无数次
        every: 'day',                //执行间隔 sec min hour day 前面加上数量
        prior: false                  //是否在定义的时候先执行一次

    };
    object.extend(opt,option,true);  //合并属性

    var first = getFirstDoTimeout(opt)
        , interval = getInterval(opt)
        , num = 0;
    //开始执行
    setTimeout(readydo,first);
    function readydo(){
        callback();
        num++;
        if(!opt.loop || opt.loop>num){ //是否还要执行
            setTimeout(readydo,interval);
        }
    }
    //预先执行一次
    if(opt.prior) callback();
};


//获取首次执行时间
function getFirstDoTimeout(opt){
    if(!opt.time) return 0;
    var inter = getInterval(opt) //间隔时间
        , tary = opt.time.split(':')
        , now = new Date()
        , nowlong = now.getHours()*60*60 + now.getMinutes()*60 + now.getSeconds()
        , hour = parseInt(tary[0])
        , min = parseInt(tary[1])
        , sec = parseInt(tary[2])
        , newTime = 0;


    if(hour) newTime +=60*60*hour;
    if(min) newTime += 60*min;
    if(sec) newTime += sec;
    nowlong*=1000;
    newTime*=1000;

    //如果定义的时间已经过去，则增加到时间为止
    for(;newTime<nowlong;newTime+=inter){}

    return newTime-nowlong;
}

//获取间隔执行时间
function getInterval(opt){
    var every = opt.every
        , time = parseFloat(every) || 1; //默认1
    if(every.indexOf('sec')>=0){ //秒

    }else if(every.indexOf('min')>=0){ //分
        time *= 60;
    }else if(every.indexOf('hour')>=0){ //小时
        time *= 60*60;
    }else if(every.indexOf('day')>=0){ //天
        time *= 60*60*24;
    }else{
        time = 60*60*24;
    }

    return time*1000;
}















