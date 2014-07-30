
/**
 * url 路由配置文件，在此处定义你的页面、api路径等等
 */



exports.view = [

    ['/','codekart'],         //网站主页 页面配置文件：app/view/codekart.js
    ['/404','404'],           //配置文件：app/view/404.js
    ['/error','error']         //配置文件：app/view/error.js
];


/*

 */

//controller带参数请求示例(不带参数的不需要配置，会自动路由)
exports.ctrl = [

    // controller控制器文件：app/controller/test/test.js ，
    // getuid为处理函数，不传默认为index
    ['/user/:uid','test/test','getuid']

    // 拦截 http://example.com/cssimg/codekart/ 路径下 png格式图片的访问
    // ['/cssimg/codekart/*.png','test','']

];












