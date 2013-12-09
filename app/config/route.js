
/**
 * url 路由配置文件，在此处定义你的页面、api路径等等
 */


var route = require_core('!server/route');



/**
 * 页面地址请求
 * （如果开启config.route，则无需在此处定义 view 处理程序路径，程序将自动路由）
 * （可以将 view 路由到一个默认返回空的处理程序上，达到屏蔽 view 的目的）
 */

//route.view({url:'/', name:'home'});  //定义主页(必须)

//下面是带url参数的路径示例（带参数的路径或多级页面必须在此处定义！）
//route.view({url:'/user/:uid', name:'user'});
//route.view({url:'/article/:aid/comment/:cid', name:'comment'});

//页面地址请求
route.view({url:'/', name:'home'});
route.view({url:'/error', name:'error'});
route.view({url:'/about', name:'about'});
//route.view({url:'/frame', name:'frame'});
route.view({url:'/register', name:'register'});
route.view({url:'/get-password', name:'getpass'});
route.view({url:'/setting', name:'setting'});
route.view({url:'/draft', name:'draft'});
route.view({url:'/notify', name:'notify'});
route.view({url:'/search', name:'search'});
route.view({url:'/user/:uid', name:'user_home'});
route.view({url:'/user/:uid/home', name:'user_home'});
route.view({url:'/article/:aid', name:'article'});
route.view({url:'/article/:aid/set-collect', name:'article_set_collect'});
route.view({url:'/collect/:cid', name:'collect'});
route.view({url:'/collect/:cid/set-cover', name:'collect_set_cover'});
route.view({url:'/collect/:cid/new-article', name:'new_article'}); //文章写作
route.view({url:'/new-article', name:'new_article'}); //文章写作
route.view({url:'/new-collect', name:'new_collect'});



/**
 * api地址请求
 * （如果开启config.route，则无需在此处定义api处理程序路径，程序将自动路由）
 * （可以将api路由到一个默认返回空的处理程序上，达到屏蔽api的目的）
 * ！无需在url参数前面加上/api前缀，系统将自动加上
 */

//route.api({url:'user/get', controller:'ctrl', action:'return_null'}); //修改controller和action可以屏蔽或重定向 api

/*
route.api({url:'/user/login'}); //登录
route.api({url:'/user/logout'}); //退出
route.api({url:'/user/register'});
route.api({url:'/user/update',login:true});
route.api({url:'/collect/create',login:true});
route.api({url:'/collect/update',login:true});
route.api({url:'/collect/search'});
route.api({url:'/article/newpost',login:true});
route.api({url:'/article/set_collect',login:true});
route.api({url:'/article/more'});
route.api({url:'/note/add',login:true});
route.api({url:'/note/get_list'});
route.api({url:'/note/get_num'});
route.api({url:'/draft/addup',login:true});
route.api({url:'/draft/delete',login:true});
route.api({url:'/notify/delete',login:true});
route.api({url:'/recom/article',login:true});
route.api({url:'/server/resetpass'});
*/


/**
 * binary 二进制数据处理
 * （如果开启config.route，则无需在此处定义 binary 处理程序路径，程序将自动路由）
 * （可以将 binary 路由到一个默认返回空的处理程序上，达到屏蔽 binary 的目的）
 * ！无需在url参数前面加上 /binary 前缀，系统将自动加上
 */

//route.binary({url:'file/upload', controller:'file', action:'upload'}); //修改controller和action可以屏蔽或重定向binary

route.binary({url:'/user/up_avatar',login:true}); //修改头像
route.binary({url:'/collect/up_cover',login:true}); //修改专辑封面




















