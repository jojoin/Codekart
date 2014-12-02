/**
 * 工具
 */


var array = require('./array');
var object = require('./object');


/**
 * 将数字id转化为字符串
 */
exports.intzip = function(a, bit){
    bit = bit || 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    if(typeof a=='number'){
        if(a==0) return bit.charAt(0);
        for(var s=""; a; a=a/bit.length|0){
            s = bit.charAt(a%bit.length)+s;
        }
        return s;
    }else if(typeof a=='string'){
        for(var s= 0,i= 0,b = a.split(''); i<b.length; i++){
            var ix = bit.indexOf(b[i]);
            if(ix==-1) return null;
            s += ix * Math.pow(bit.length,b.length-i-1);
        }
        return s;
    }
    return null;
};


/**
 * 依赖关系排序算法，不可处理循环依赖
 */
exports.sortDependence = function(deps,stuff){

    return extend();

    function extend(stu){
        stu = stu || object.clone(stuff);
        var cpstu = object.clone(stu);
        //console.log(deps);
        //console.log(stu);
        var len = stu.length
            , is = 0;
        for(var s in stu){
            var yl = deps[stu[s]];
            //console.log(stu[s]+'  yl  '+yl);
            if(yl){
                for (var y in yl) cpstu.splice(is, 0, yl[y]);
                is += yl.length;
            }
            is++;
        }
        cpstu = array.unique(cpstu); //去重
        if(cpstu.length>len){ //下一层递归
            return extend(cpstu);
        }
        return cpstu;
    }

};


