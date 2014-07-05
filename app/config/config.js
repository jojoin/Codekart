
/**
 * 网站配置文件
 */


//配置对象（全局）
module.exports = {

    //端口监听
    port: {
        http: 82,
        websocket: 92           // 如果将此端口号设为0，则不开启websocket服务
    },

    version: '01100',            // 程序版本号 用于更新改版后的 js css 客户端缓存

    worker: 2,                        // 开启的worker工作者线程的数量，当值为0则与CPU核心数量相同
    forkdelay: 1000,             // 当worker错误退出时  fork子进程的延迟时间（毫秒）

    websocket_compatible: false,              // 在不原生支持 WebSocket 的开启的浏览器上 开启 http polling兼容方案
    http_polling_timeout: 2500,                 // http兼容方案 polling 时间间隔（毫秒）

    debug: false,                    // 是否为调试模式  调试会将错误抛出终止进程
    compiled: false,               // 是否总是编译html、js、css等页面文件（比较耗时，debug时使用）
    compress: true,            // 是否压缩js、css文件（比较耗时，debug时关闭）

    expires: 60*60*24*7                       // 静态文件客户端缓存时间
};