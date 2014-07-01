/**
 * 日志系统配置
 *
 */


/**
 'fatal',
 'error',
 'warning',
 'notice',
 'info',
 'debug'  // 默认日志类型
 'time'
  ...
 */
exports.allow = []; //允许显示的日志种类  白名单
exports.not_allow = []; //不允许显示的日志种类   黑名单 更高优先级


/**
 * 是否包裹消息，出现在每一条日志的首尾处
 */
//exports.wrap_before = '<${type}>';  // ${type}为日志种类名称 ，${time} 为当前时间
//exports.wrap_before = '<${type} time="${time}">\n';
exports.wrap_before = '';
//exports.wrap_after = '\n</${type}>';
exports.wrap_after = '';


/**
 * out_file 自定义输出日志到文件
 * 输出到 log/ 目录下 省略 .log 后缀名
 */
//exports.out_file = 'output';
exports.out_file = false;


/**
 * 你可以针对不同的日志种类 进行不同的附加(覆盖)配置
 * 支持的自定义配置有 ：
 * wrap_before , wrap_after , out_file
 */
exports.fatal = {
    //wrap_before: '<${type} time="${time}">'
};

