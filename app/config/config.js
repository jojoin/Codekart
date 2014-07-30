
/**
 * 框架配置
 */


/* *
 * 端口监听
 */
exports.port = {
    http: 82
};


/* *
 * 程序版本号 用于更新改版后的 js css 客户端缓存
 */
exports.version =  '01100';


/* *
 * 开启的worker工作者线程的数量，当值为0则与CPU核心数量相同
 */
exports.worker = 2;


/* *
 * 当worker错误退出时  fork子进程的延迟时间（毫秒）
 */
exports.forkdelay = 1000;


/* *
 * 是否为调试模式
 * 调试模式将打印详细的错误消息
 */
exports.debug = false;


/* *
 * 是否总是编译html、js、css等页面文件
 * （比较耗时，debug时使用）
 */
exports.compiled = false;


/* *
 * 是否压缩js、css、tpl文件
 * （比较耗时，debug时关闭）
 */
exports.compress = {
    js: true,
    css: true,
    tpl: true //压缩tpl文件 将导致<pre>标签不可用！
};


/* *
 * 静态文件客户端缓存时间
 * 更为详细的配置请参看 config/define.js 中 static_url_path 项
 */
exports.expires = 60*60*24*7;

