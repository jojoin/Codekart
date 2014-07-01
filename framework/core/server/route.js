/**
 * 请求路由模块
 */


var url = require('url');
var path = require('path');
var object = load.tool('object');
var file = load.tool('file');
var config =  load.config();
var route =  load.config('route');


//路由注册数组
var routes = exports.routes = {
    view:[],
    controller:[]
};



/**
 * 匹配url类型，返回url的key参数
 */
exports.match = function(pathname,sort){

    var route = routes[sort]  //已注册的url
        , leg = route.length;
    for(var k=0;k<leg;k++){
        //依次匹配路由
        var rou = route[k]
            , urlkeyname = []
            , rex = pathRegexp(rou.url,urlkeyname);
        var args = rex.exec(pathname); //正则匹配

        if(args){ /*匹配完成*/
            var param = {};
            args.shift(); //第一个值为匹配到的整个url，后面才是匹配的的值
            var leng = urlkeyname.length;
            for(var n=0;n<leng;n++){
                param[urlkeyname[n]] = args[n]; //url内的参数 如 :uid
            }
            return {param:param,route:rou}; //匹配路径 返回
        }
    }

    //未匹配到
    return null;

};



/**
 * 添加注册路由规则
 */

var add = exports.add = function(url,sort,ext){
    var def = { //默认值
        url : url,                //原始url
        sort: sort
    };
    object.extend(def,ext,true);
    routes[sort].push(def); //添加规则
};

exports.view = function(url,view){
    add(url,'view',{view:view});
};

exports.ctrl = function(url,ctrl,action){
    add(url,'controller',{
        controller:ctrl,  //控制器
        action:action || 'index'   //处理函数
    });
};






/**
 * 将url处理成带参数的类
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/acticle/:aid/talk/:tid" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */
var pathRegexp = exports.pathRegexp = function(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (Array.isArray(path)) path = '(' + path.join('|') + ')';
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
            //keys.push({ name: key, optional: !! optional });
            keys.push(key);
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};


/**
 * 自动读取配置文件并加载路由配置
 */

//加载页面配置
if(route&&route.view){
    var leg = route.view.length
        , view = route.view;
    //倒序添加，覆盖规则
    while(leg--){
        var one = view[leg];
        //通过参数添加页面配置
        add(one[0],'view',{view:one[1]});
    }
}



//加载控制器配置
if(route&&route.ctrl){
    var leg = route.ctrl.length
        , ctrl = route.ctrl;
    //倒序添加，覆盖规则
    //倒序添加，覆盖规则
    while(leg--){
        var one = ctrl[leg];
        //通过参数添加控制器配置
        add(one[0],'controller',{
            controller:one[1],  //控制器
            action:one[2] || 'index'   //处理函数
        });
    }
}




