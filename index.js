
/**
 * ===================================================
 * 欢迎使用node前后端一体开发框架 Codekart ！
 * ===================================================
 *
 * 这是一个开源框架，你可以任意修改和使用它（包括但不限于技术研究与分享、开源项目或者商业产品）。
 *
 * 本框架最初来自 君鉴网(jojoin.com) 的开发实战和积累，如今你可以在下面的地址找到它并下载和学习使用：
 * ┌───────────────────────────┐
 * │源码地址：https://github.com/yangjiePro/codekart
 * │官方主页：https://codekart.jojoin.com
 * │文档手册：https://docs.codekart.jojoin.com
 * └───────────────────────────┘
 *
 * 也欢迎你联系本框架的作者，提出建议或者bug，进行技术交流：
 * ┌───────────────────────────┐
 * │作者：杨捷
 * │邮箱：yangjie@jojoin.com
 * │QQ  ：446342398
 * └───────────────────────────┘
 *
 */


/**
 * 环境配置 配置文件路径
 * ENVIRONMENT 对应 app/config 下相应的配置文件目录
 * ENVIRONMENT=='development'  对应 app/config/development 配置文件目录
 * ENVIRONMENT 下的配置文件会覆盖app/config下的配置
 * ENVIRONMENT 为全局变量 配置文件下使用
 */
//global.ENVIRONMENT = '';
//global.ENVIRONMENT = 'production';
//global.ENVIRONMENT = 'test';
global.ENVIRONMENT = 'development';


/**
 * 加载全局函数/对象
 */
require('./framework/function.js');


/**
 * 初始化框架
 */
load.core('!init');


/**
 * 加载url路由规则
 */
load.core('!server/route');


/**
 * 启动web服务器
 */
load.core('!server').run();










