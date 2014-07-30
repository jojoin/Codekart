/**
 * 日志系统配置
 *
 */


/** 以下是框架含有日志种类
 'fatal',
 'error',
 'warning',
 'notice',
 'info'
 */


/**
 * 自定义的日志种类，添加后可以在后面修改配置
 * 【注意】自定义的日子种类名称不能与下面的
 */
exports.custom = [];


/**
 * 允许显示的日志种类  白名单 定义后其它的日志
 */
//exports.allow = ['fatal','error','warning'];
exports.allow = [];


/**
 * 不允许显示的日志种类   黑名单 更高优先级
 * 如果定义了白名单，也会
 */
//exports.not_allow = ['notice','info'];
exports.not_allow = [];


/**
 * 是否包裹消息，出现在每一条日志的首/尾处
 * ${type} 会被替换为当前日志种类名称
 * ${time} 会被替换为当前时间
 * \n 换行
 */
//exports.wrap_before = '<${type}>';  // ${type}为日志种类名称 ，${time} 为当前时间
//exports.wrap_before = '<${type} time="${time}">\n';
exports.wrap_before = '\n'; //每条日志换行
//exports.wrap_after = '\n</${type}>';
exports.wrap_after = '';


/**
 * file 自定义输出日志到文件
 * 输出到 app/log/ 目录下 省略 .log 后缀名
 */
//exports.file = 'output';
//exports.file = 'path/output'; //可以自定义路径
exports.file = false;


/**
 * 按时间分别保存日志文件，需要定义 exports.file 项
 * year     month     day       hour          day/4          month/10
 * 按年    按月        按天     按小时      每天4个     每月分为10个文件
 * 【注意】如果日志的数据量较大，不开启日志分割，那么日志将一直以追加方式写入同一个文件，
 * 一段时间后，你将会得到一个巨大无比的日志文件！如果你不会经常查看和手动清空日志文件，强烈建议开启此项！
 */
//exports.file_split = 'day'; //按天保存
exports.file_split = false;


/**
 * 你可以针对不同的日志种类 进行不同的附加(覆盖)配置
 * 支持的自定义配置有 ：
 * wrap_before , wrap_after , file , file_split
 * 下面是一些示例配置，你可以取消某些项目的注释让其生效
 */
exports.each = {
    'fatal':{
        //wrap_before: '<${type} time="${time}">'  //把fatal日志用 <fatal time="20040509 09:23:04"></fatal> html标签包裹起来
        //wrap_after: '</${type}>'
    },
    'error':{
        //wrap_before: '\n${time}\n' //将错误日志加上时间
        //file:'error' //将 error 日志保存到文件： app/log/error.log
    }
};

