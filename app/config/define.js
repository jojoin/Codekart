/**
 * 定义开发相关的常量
 */

/************* 可以再此处定义你需要的常量 ************/

exports.your_define_example = 'int, string, object or anything';











/************* 下面是框架所需配置定义 请勿删除 谨慎修改 ************/



//浏览器端 js 模块的依赖关系（先后关系）
exports.client_js_depend = {
    //在此处添加你的前端js模块依赖关系
    //【注意】不可出现循环依赖，否则程序会进入死循环!!!


    //下面是Codekart框架前端js模块依赖关系 如无必要请勿修改
    'ajax.ck': ['json.ck'],
    'websocket.ck': ['ajax.ck']
};


// 在浏览器端保存 html 模板的 JS 全局数组变量名称
exports.client_tpl_var = 'Tpls';


// 在浏览器不支持 WebSocket 的情况下  采用 http 轮询作为替代方案
// 下面的定义是 http 轮询的 baseurl 例如：
// http://yourdomain.com/_websocketpolling_/connect
exports.ws_polling_baseurl = '_websocketpolling_';



