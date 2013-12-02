/**
 * 请求路由模块
 */


var url = require('url');
var path = require('path');
var object = require_tool('object');
var file = require_tool('file');

//根据http请求的method来分别保存route规则

var routes = exports.routes = {view:[], api:[], binary:[]};
//路由缓存
var routeCache = {view:{}, api:{}, binary:{}};


/**
 * 匹配url
 */
exports.match = function(urlpath,met){

    //开始匹配 app/config/route.js 里面定义的路径
    var re = {},
    // url: /blog/index?page=1 ,则pathname为: /blog/index
        pathname = url.parse(urlpath).pathname;
    var m_routes = routes[met]
        , leg = m_routes.length;
    for(var k=0;k<leg;k++){
        //正则匹配
        var keys = []
            , rex = pathRegexp(m_routes[k].url,keys);
        var args = rex.exec(pathname); //正则匹配

        if(args){ /*匹配完成*/
            re = m_routes[k];
            args.shift(); //第一个值为匹配到的整个url，后面才是匹配的的值
            var leng = keys.length;
            for(var n=0;n<leng;n++){
                re.key[keys[n]] = args[n]; //url内的参数 如 :uid
            }
            return re; //匹配路径 返回
        }
    }

    //搜索文件匹配处理程序
    if(config.route){
        return searchDeal(pathname,met);
    }else{
        return false;  //没找到匹配的url
    }
};


/**
 * 搜索文件查找路由处理程序
 */
function searchDeal(pathname,met){
    //pathname 格式 /api/user/get
    var arg = pathname.split("/")
        , ctrl = path.dirname(pathname) //.replace('/api','').replace('/binary','')
        , func = arg[arg.length-1];
    if(met=='api' || met=='binary'){
        if(ctrl&&func){
            return {
                controller: ctrl,
                action: func
            };
        }else{
            return false
        }
    }else if(met=='view'){
        var page = arg[1] || 'html';
        return {name:page};
    }else{
        return false;
    }

}




/**
 * 注册路由规则
 */
var map = exports.map = function(dict,met){
    if(dict && dict.url && dict.controller){
        var d = { //默认值
            url : '/',
            path : '/view', //路径
            controller : 'view', // 处理类
            action : 'view', //处理函数
            option : {}, //附带参数
            key:{},//url路径参数
            login : false //是否需要登录

        };
        object.extend(d,dict,true);
        routes[met].push(d); //添加规则
    }
};

/**
 * 注册api服务器路由
 */
exports.api = function(dict){
    var arg = dict.url.split("/");
    dict.controller = dict.controller || arg[1];
    dict.action = dict.action || arg[2];
    dict.url = '/api/' + dict.url; //自动加上
    dict.path = '/api';
    map(dict,'api');
};

/**
 * 提交二进制数据处理
 */
exports.binary = function(dict){
    var arg = dict.url.split("/");
    dict.controller = arg[1];
    dict.action = arg[2];
    dict.url = '/binary/' + dict.url;
    dict.path = '/binary';
    map(dict,'binary');
};

/**
 * 注册web页面服务器路由
 */
exports.view = function(dict){
    dict.path = '/view';
    dict.action = 'view';
    dict.controller = 'view';
    map(dict,'view');
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

