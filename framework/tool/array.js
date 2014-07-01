
//数组



//数组去重
exports.unique = function(ary)
{
    var n = {},r=[],leg=ary.length; //n为hash表，r为临时数组
    for(var i = 0; i < leg; i++) //遍历当前数组
    {
        if (!n[ary[i]]) //如果hash表中没有当前项
        {
            n[ary[i]] = true; //存入hash表
            r.push(ary[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
};


/*
//这样更高效
exports.unique = function(arr){
    var len = arr.length,
        i = 0,
        ret = [];
    for(;i<len;i++){
        if(arr.indexOf(arr[i]) === i){
            ret.push(arr[i]);
        }
        return ret;
    }
};
 */




//按照某一项进行排序
exports.seque = function (array,ary,name) {
    var leg = array.length
        , num = ary.length;
    for(var k=0;k<num;k++){
        var nk = ary[k];
        for(var x=leg-1;x>=0;x--){
            if(array[x][name]==nk){
                var one = array[k];
                array[k] = array[x];
                array[x] = one; //互换
                break;
            }
        }
    }
};





//获取一个数组之中某项的某个属性为多少的项
exports.matchItem = function(ary,key,value,del){
    var leg = ary.length;
    for(var i=0;i<leg;i++){
        if(value == ary[i][key]){
            if(del) return ary.splice(i,1);
            else return ary[i];
        }
    }
    return null;
};


// 取得数组中元素的某个属性 单独返回数组元素
exports.listem = function (ary,key) {
    var reary = []
        , leg = ary.length;
    for(var i=0; i<leg; i++){
        var d = ary[i][key];
        d?reary.push(d):0;
    }
    return reary;
};



//判断书否为数组，返回true或false
exports.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};


//判断数组是否包含某，返回true或false
exports.inArray = function (item,ary) {
    var leg = ary.length;
    for(var i=0;i<leg && ary[i]!=item;i++);
    return !(i==leg);
};


//按数组其中一项的某一个值合并数值
exports.consrct = function (ary1,ary2,name) {

    var leg1 = ary1.length
        , leg2 = ary2.length;
    //第一步从第二数组拷贝没有的到第一个数组
    for(var k2=0;k2<leg2;k2++){
        var ary2_k2 = ary2[k2]
            , ary2_k2_value = ary2_k2[name];
        if(undefined===ary2_k2_value) continue;
        var ary1One = consrct__get_item(ary1,name,ary2_k2_value);
        if(ary1One==null){
            ary1.push(ary2_k2); //拷贝
        }
    }
    //第二步覆盖第一个数组
    for(var k1 in ary1){
        var ary1_k1 = ary1[k1]
            , ary1_k1_value = ary1_k1[name];
        if(undefined===ary1_k1_value) continue;
        var ary2One = consrct__get_item(ary2,name,ary1_k1_value);
        if(null!=ary2One){
            for(var x in ary2One){
                ary1_k1[x] = ary2One[x];
            }
        }
    }
};

//取得某一项

function consrct__get_item(ary,name,value){
    for(var k in ary){
        if(value==ary[k][name]) return ary[k];
    }
    return null;
}

