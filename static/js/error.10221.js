Tpls={};


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

/*
 json2.js
 2012-10-08

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 json.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = json.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = json.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = json.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 json.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = json.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = json.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", json, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof json !== 'object') {
    json = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof json.stringify !== 'function') {
        json.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('json.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof json.parse !== 'function') {
        json.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('{' + text + '}');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('json.parse');
        };
    }
}());

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



/**
 * 微型模板引擎 tmpl 0.2
 *
 * 0.2 更新:
 * 1. 修复转义字符与id判断的BUG
 * 2. 放弃低效的 with 语句从而最高提升3.5倍的执行效率
 * 3. 使用随机内部变量防止与模板变量产生冲突
 *
 * @author	John Resig, Tang Bin
 * @see		http://ejohn.org/blog/javascript-micro-templating/
 * @name	tmpl
 * @param	{String}	模板内容或者装有模板内容的元素ID
 * @param	{Object}	附加的数据
 * @return	{String}	解析好的模板
 *
 * @example
 * 方式一：在页面嵌入模板
 * <script type="text/tmpl" id="tmpl-demo">
 * <ol title="<%=name%>">
 * 	<% for (var i = 0, l = list.length; i < length; i ++) { %>
 * 		<li><%=list[i]%></li>
 * 	<% } %>
 * </ol>
 * </script>
 * tmpl('tmpl-demo', {name: 'demo data', list: [202, 96, 133, 134]})
 *
 * 方式二：直接传入模板：
 * var demoTmpl =
 * '<ol title="<%=name%>">'
 * + '<% for (var i = 0, l = list.length; i < length; i ++) { %>'
 * +	'<li><%=list[i]%></li>'
 * + '<% } %>'
 * +'</ol>';
 * var render = tmpl(demoTmpl);
 * render({name: 'demo data', list: [202, 96, 133, 134]});
 *
 * 这两种方式区别在于第一个会自动缓存编译好的模板，
 * 而第二种缓存交给外部对象控制，如例二中的 render 变量。
 */

window.tmpl = (function (cache, $) {
    return function (str, data) {
        var fn = !/\s/.test(str)
            ? cache[str] = cache[str]
            || tmpl(document.getElementById(str).innerHTML)

            : function (data) {
            var i, variable = [$], value = [[]];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            };
            return (new Function(variable, fn.$))
                .apply(data, value).join("");
        };

        fn.$ = fn.$ || $ + ".push('"
            + str.replace(/\\/g, "\\\\")
            .replace(/[\r\t\n]/g, " ")
            .split("[%").join("\t")
            .replace(/((^|%])[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%]/g, "',$1,'")
            .split("\t").join("');")
            .split("%]").join($ + ".push('")
            .split("\r").join("\\'")
            + "');return " + $;

        return data ? fn(data) : fn;
    }})({}, '$' + (+ new Date));


//全站服务模块

window.pro = (function(json,cookie){

    var PO = {}
        ,urlBase = '/api/'
        ,debug = false; //是否为调试模式

    //调用后台接口 获取数据
    PO.api = function(name,get,post,callback,errorback){
        //gost_loading.show();
        name = urlBase+name;//加上url
        var upcode = new Date().getTime()
            ,gets = {v_u_p:upcode};

        if(get!=null){
            gets = $.extend(gets,get);
        }
        if(post!=null){
            var geturl = '';
            for(var p in gets){
                geturl += p+'='+gets[p]+'&';
            }
            name += '?' + geturl.substring(0,geturl.length-1);//去掉末尾的 & 字符
            $.post(name,post,function(DATA){
                dealBackData(DATA,callback,name,errorback);
            },'html');
        }else{ //没有post参数
            $.get(name,gets,function(DATA){
                dealBackData(DATA,callback,name,errorback);
            },'html');
        }
    };


    //处理接口返回的数据
    function dealBackData(DATA,callback,url,errorback){
       eval(' var JsonOb = '+DATA+';');
        //{"code":"","msg":"","data":[]}
        if(JsonOb.code==200){
            callback(JsonOb.data);//正常状态调用回调
        }else{
            if(debug){
                $('body').prepend(JsonOb.msg+'，请求：'+url+'<br/>');
            }
            if(errorback) errorback(JsonOb); //错误处理
            //alert('返回状态出错！');
        }
        //gost_loading.hide();
        return JsonOb.msg;
    }



    //数据库转义恢复
    PO.ds = function(str){
        return str.replace(/\\'/g,"'")
            .replace(/\\"/g,'"');
    };


    //获取网页gets参数和#哈希参数
    PO.gets = GetRequest(location.search,'?');
    PO.hash = GetRequest(location.hash,'#');
    function GetRequest(url_str,cx) {
        var theRequest = []
            , leg = 0;
        if (url_str.indexOf(cx) != -1) {
            var str = url_str.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                var key = strs[i].split("=")[0]
                    , value = strs[i].split("=")[1];
                if(value){
                    leg++; //有参数
                    theRequest[key]=unescape(value);
                }
            }
        }
        return leg>0?theRequest:(url_str.replace(cx,''));
    }

    return PO;

})(json,cookie);