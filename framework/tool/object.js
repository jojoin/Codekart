
var array  = require('./array.js');

/**
* 深层合并两个对象，override表示是否覆盖前面的属性值
* */
exports.extend = function(tObj,sObj,override){
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