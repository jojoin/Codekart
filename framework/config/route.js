
/**
 * url 路由配置文件，在此处定义你的页面、api路径等等
 */


exports.view = [

 //   ['/','home'],                //网站主页 页面配置文件：app/view/home.js
 //   ['/404','home'],         //配置文件：app/view/404.js
 //   ['/error','home']         //配置文件：app/view/error.js

];


/*
 controller控制器文件：app/controller控制器文件/test/test.js ，getuid为处理函数，不传默认为index
 */
//['/cssimg/codekart/*.png','test','']  //屏蔽静态文件访问

//controller带参数请求示例(不带参数的不需要配置，会自动路由)
exports.ctrl = [

  //  ['/user/:uid','test/test','getuid']

];
















