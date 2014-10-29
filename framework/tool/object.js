
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
 * @param strong 是否将 null '' 0 false 等都视为无效
 * */
exports.InvalidAttr = function(obj, attrs, strong){
    if(typeof obj!=='object'){
        return true;
    }
    if(typeof attrs=='string'){
        attrs = [attrs];
    }
    for(var a in attrs){
        if(strong ? !obj[attrs[a]] : obj[attrs[a]]===undefined){
            return attrs[a]; //无效的属性
        }
    }
};





/**
* 深层合并两个对象，override表示是否覆盖前面的属性值
* */
exports._extend = function(tObj,sObj,override){
    if(!tObj || !sObj || typeof sObj!=='object') return;
    if(typeof sObj!=='object') tObj = {};
    for(var i in sObj){
        if(typeof sObj[i] !== "object"){
            if(override || !tObj[i]) tObj[i] = sObj[i];
        }else{
            tObj[i] = tObj[i] || {};
            exports.extend(tObj[i],sObj[i]);
        }
    }
};



/**
 * 深层合并多个对象
 * 最左边的参数被修改  并返回合并后的对象
 */
exports.extend = function () {
    var target = arguments[0] || {},
        i, length = arguments.length,
        options, src, copy, clone, name;
    for (i = 1; i < length; ++i) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) !== null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging objects
                if (typeof(copy) == "object") {
                    clone = (src && typeof(src) == "object" ? src : {});
                    target[name] = exports._extend(clone, copy);
                }
                // Don't bring in undefined values
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
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
