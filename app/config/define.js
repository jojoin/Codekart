/**
 * 定义开发相关的常量
 */

/************* 可以再此处定义你需要的常量 ************/

exports.your_define_example = 'int, string, object or anything';











/************* 下面是框架所需配置定义 请勿删除 谨慎修改 ************/






/**
 * 指定由静态文件服务器处理的url一级路径
 * 例如 http://example.com/static_path/img/picture.jpg
 * 如果你确认/static_path下全部为静态文件的url
 * 则在下方添加 'static_path'
 * 添加静态路径将跳过 view 和 controller 的url匹配检查
 * 这将大大提升服务器处理静态文件的效率
 * 如果你的静态文件不带有后缀名,或者是不规则的路径
 * 那么就需要定义下面的路径, 以防止被路由到view 和 controller处理
 * [注意] 如果你定义了此项, 那么处理程序就不会路由到view 和 controller之上!
 */
exports.static_url_path = {
    'img': {
        expires: 3600 //客户端缓存时间
    },
    'cssimg': {},
    'js': {},
    'css': {},
    'jslib': {},
    'csslib': {}
    /*
    'mp3':{
        //root:'/data/storge/'  //指定读取静态文件处理的位置(末尾必须加'/')
        //例如http://example.com/mp3/music/001.mp3 对应本地文件:
        // '/data/storge/mp3/music/001.mp3'
    }
    */
};


/**
 * 浏览器端 js 模块的依赖关系（先后关系）
 * 【注意】不可出现循环依赖，否则程序会进入死循环!!!
 */
exports.client_js_depend = {
    //在此处添加你的前端js模块依赖关系


    //下面是Codekart框架前端js模块依赖关系 如无必要请勿修改
    'ajax.ck': ['json.ck','url.ck','init.ck'],
    'websocket.ck': ['ajax.ck','init.ck']
};


/**
 * css 及 less 文件中的<%cssimg%>将被替换的字符串'/cssimg/'
 * 一般采用<%和%>包裹防止替换出错和冲突
 * 可以在此添加定义你的css图片的url
 */
exports.css_parse_replace = {
    '<%cssimg%>': '/cssimg/'
    /* 添加你的替换字符串*/
};


/**
 * 在浏览器端保存 html 模板的 JS 全局数组变量名称
 */
exports.client_tpl_var = 'Tpls';