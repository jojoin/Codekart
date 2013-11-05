
/**
 * 网站配置文件
 */

var path = require('path');
//向上返回两层
var b = path.dirname(path.dirname(__dirname)); //codetank文件夹路径

//配置对象（全局）
exports = global.config = {

    //端口监听
    port: {
        http: 80,
        websocket: 83
    },

    version: '10221', //程序版本号 用于更新改版后的 js css 客户端缓存
    route: true,  //是否开启默认路由匹配（在未定义的情况下，搜索文件查找处理程序）
    cluster: false,  //是否开启多核及守护进程
    compiled: true,  //是否总是编译html、js、css等页面文件（debug使用）
    compress: false,   //是否压缩js、css文件（比较耗时，debug推荐关闭）
    expires: 60*60*24,  //静态文件缓存时间

    //mysql数据库配置（需要安装node-mysql模块）
    mysql: {
        host:'127.0.0.1',
        database:'jojoin',
        user:'jojoin',
        password:'jojoinpass'
    },

    //站点配置
    site: {
        name: '君鉴',
        motto: '打破常规 透彻本质',
        intro:'一个优质文章阅读、写作与分享社区。',
        domain: 'jojoin.com',
        url: 'http://jojoin.com/',
        info: ''
    },


    /***************************************************************************\
     请勿修改下面的配置
    \***************************************************************************/

    //路径配置
    path: {
        base:b,
        app: b+'/app', //程序目录
        framework: b+'/framework', //框架核心目录

        api: b+'/app/api', //程序目录

        js: b+'/app/stuff/js', //前端js文件
        less: b+'/app/stuff/less', //前端less文件
        tpl: b+'/app/stuff/tpl', //前端tpl模板文件

        static:b+'/static',   //静态文件目录
        tmp:b+'/tmp'   //临时文件目录
    }
};