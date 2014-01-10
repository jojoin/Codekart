
/**
 * url 路由配置文件，在此处定义你的页面、api路径等等
 */


var route = load.core('!server/route');



//页面地址请求
route.view('/','home');         //网站主页 页面配置文件：app/view/home.js
route.view('/404','404');   //配置文件：app/view/404.js
route.view('/error','error'); //配置文件：app/view/error.js


//下面是带url参数的路径示例
//route.view('/user/:uid', 'user');
//route.view('/article/:aid/comment/:cid', 'article/comment'); //配置文件：app/view/article/comment.js


//controller带参数请求示例(不带参数的不需要配置)
route.ctrl('/user/:uid','test/test','get_uid');  //controller控制器文件：app/controller控制器文件/test/test.js ，get_uid为处理函数


















