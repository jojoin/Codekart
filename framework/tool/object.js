
var array  = require('./array');
var string  = require('./string');



/**
 * 判断是否为字符串 数组等等  返回true或false
 */
exports.isNumber =  function (source) {
    return '[object Number]' == Object.prototype.toString.call(source);
};
exports.isObject =  function (source) {
    return '[object Object]' == Object.prototype.toString.call(source);
};
exports.isString = string.isString;
exports.isArray = string.isArray;





/**
 * 检查对象属性值，返回不存在的，或不满足要求的
 * @param strict 是否将 null '' 0 false 等都视为无效
 * */
exports.InvalidAttr = function(obj, attrs, strict){
    if(typeof obj!=='object'){
        return true;
    }
    if(typeof attrs=='string'){
        attrs = [attrs];
    }
    for(var a in attrs){
        if(strict ? !obj[attrs[a]] : obj[attrs[a]]===undefined){
            return attrs[a]; //无效的属性
        }
    }
    return null;
};



/**
* 深层合并两个对象，override表示是否覆盖前面的属性值
* */
exports.extend = function(tObj, sObj, override){
    if(!tObj || !sObj || typeof sObj!=='object') return;
    if(typeof sObj!=='object') tObj = {};
    for(var i in sObj){
        if(typeof sObj[i] !== "object"){
            if(override || !tObj[i]) tObj[i] = sObj[i];
        }else{
            tObj[i] = tObj[i] || {};
            exports.extend(tObj[i],sObj[i],override);
        }
    }
};

/**
 * 对象的深拷贝！
 * */
exports.clone = function(jsonObj){
    var buf;
    if (jsonObj instanceof Array) {
        buf = [];
        var i = jsonObj.length;
        while (i--) {
            buf[i] = arguments.callee(jsonObj[i]);
        }
        return buf;
    }else if (typeof jsonObj == "function"){
        return jsonObj;
    }else if (jsonObj instanceof Object){
        buf = {};
        for (var k in jsonObj) {
            buf[k] = arguments.callee(jsonObj[k]);
        }
        return buf;
    }else{
        return jsonObj;
    }
};