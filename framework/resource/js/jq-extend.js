/**
 * $ 扩展
 */


//隐形滚动条
$.fn.hiddenScroll = function(step){
    step = step || 50;
    var $this = $(this)
        , $paper = $this.children('.paper');
    $this.css({overflow:'hidden'});
    $paper.css({position:'relative',top:0});
    $this.mousewheel(function(event,delta){
        var hW = $this.height()
            , hP = $paper.height()
            , diff = hP- hW;

        if(diff>0){
            var k = delta<0?-1:1
                , top = parseInt($paper.css('top')) + step*k;
            top = top>0?0:top;
            top = -top>diff?-diff:top;
        }else{
            top=0;
        }
        $paper.css({top:top})
    });
};


//页面滚动条转到的位置
$.fn.posTo = function(time,move,isPoint,border,$scrWrap){
    time = time || 0;
    move = move || 0;
    var that = $(this)
        , top = that.offset().top;

    if(border=='bottom'){
        top -= document.documentElement.clientHeight;
        top += that.innerHeight();
    }
    $scrWrap = $scrWrap || $('html, body');
    $scrWrap.animate({ scrollTop:top+move+$scrWrap.scrollTop()},time,function(){
        if(isPoint){
            that.point();
        }
    });

};


//互换text或属性 和 actext
$.fn.swapActext = function(attr){
    var that = $(this)
        ,actext = that.attr('actext')
        ,text = '';
    if(attr){
        text = that.attr(attr);
        that.attr(attr,actext);
    }else{
        text = that.html();
        that.html(actext);
    }
    that.attr('actext',text);
};


//背景颜色淡黄渐变，吸引用户
$.fn.point = function(){
    var that = $(this)
        ,attr = 'backgroundColor';
    function flicker(k){
        var color = 'rgba(255,255,'+(155+k*10)+',1)'
            ,time = k>0?1000:0;
        setTimeout(function(){
            that.css(attr,color);
        },k*360+time);
    }
    for(var i=0;i<=10;i++){
        flicker(i);
    }
};


//背景颜色闪烁，提醒用户
$.fn.attention = function(color){
    color = color?color:'#fcf9b3';
    var that = $(this)
        ,attr = 'backgroundColor'
        ,old = that.css(attr)
        ,cor = [color,old];
    function flicker(k){
        setTimeout(function(){
            that.css(attr,cor[k%2]);
        },k*120);
    }
    for(var i=0;i<6;i++){
        flicker(i);
    }
};


/* textarea 自适应高度 */
$.fn.autoTextarea = function(options) {
    var $this = $(this)
        , defaults={
            max:null,
            min:$this.height(),
            evn:''
        }
        , opts = $.extend({},defaults,options);
    $this.css({resize:'none'});
    $this.bind("paste cut keyup focus blur"+opts.evn,function(){
        var height,style=this.style,$this = $(this);
        this.style.height =  opts.min + 'px';
        if (this.scrollHeight > opts.min) {
            if (opts.max && this.scrollHeight > opts.max) {
                height = opts.max;
                style.overflowY = 'scroll';
            } else {
                style.overflowY = 'hidden';
                height = this.scrollHeight ;
            }
            var outer = $this.innerHeight()-$this.height();
            //alert(parseInt(this.style.paddingTop)+parseInt(this.style.paddingBottom));
            style.height = height-outer  + 'px';
        }
    });
};



/*! Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.2
 *
 * Requires: 1.2.2+
 */
((function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})($));



