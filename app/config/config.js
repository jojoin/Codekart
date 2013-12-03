
/**
 * 网站配置文件
 */

var path = require('path');
//向上返回两层，到达框架跟目录
var b = path.dirname(path.dirname(__dirname)); //codetank文件夹路径

//配置对象（全局）
exports = global.config = {

    //端口监听
    port: {
        http: 90,
        websocket: 91
    },

    version: '12031', //程序版本号 用于更新改版后的 js css 客户端缓存
    route: true,  //是否开启默认路由匹配（在未定义url处理程序的情况下，搜索文件位置查找处理程序）
    cluster: false,  //是否开启多核及守护进程
    compiled: true,  //是否总是编译html、js、css等页面文件（比较耗时，debug时使用）
    compress: false,   //是否压缩js、css文件（比较耗时，debug时关闭）
    expires: 60*60*24,  //静态文件缓存时间

    //站点配置
    site: {
        name: 'CodeTank',                                                  //你的网站名称，将被显示成默认网页标题
        motto: '写得更少 做的更多',                                   //网站口号
        intro:'Node.js 前后端一体化 MVC 框架',              //网站简介
        domain: 'codetank.jojoin.com',                              //域名
        url: 'http://codetank.jojoin.com',                              //url
        info: ''
    },




    /* 如无必要请勿修改下面的配置  */

    //路径配置
    path: {
        base:b,
        app: b+'/app', //程序目录
        framework: b+'/framework', //框架核心目录

        api: b+'/app/api', //api
        model: b+'/app/model', //

        js: b+'/app/stuff/js', //前端js文件
        less: b+'/app/stuff/less', //前端less文件
        tpl: b+'/app/stuff/tpl', //前端tpl模板文件

        static:b+'/static',   //静态文件目录
        tmp:b+'/tmp'   //临时文件目录
    }
};