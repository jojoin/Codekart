
// https://github.com/yangjiePro/tppl

function tppl(tpl, data, fast){
    var fn =  function (d, f) {
        if(f||fast){
            fn.$$ = fn.$$ || new Function(fn.$);
            return fn.$$.apply(d);
        }else{
            var i, k = [], v = [];
            for (i in d) {
                k.push(i);
                v.push(d[i]);
            };
            return (new Function(k, fn.$)).apply(d, v);
        }
    };
    if(!fn.$){
        fn.$ = 'var $="";';  //    tar      if(ok){:]yang[=:abc:]jie    }:]get
        var tpls = tpl.replace(/[\n\r]/g, "").split('[:')
            , i = 0
        while(i<tpls.length){
            var p = tpls[i]
            if(i){
                var x = p.indexOf(':]');
                fn.$ += p.substr(0, x);
                p = p.substr(x+2)
            }
            fn.$ += "$+='"+p.replace(/\'/g,"\\'").replace(/\[\=\:(.*?)\:\]/g, "'+$1+'")+"';";
            i++;
        }
        fn.$ += "return $";
    }

    return data ? fn(data) : fn;
}



// 对外接口
module.exports = tppl;