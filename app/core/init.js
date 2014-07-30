/**
 * Codekart 框架启动初始化时  会调用此脚本
 * 你可以在此进行 定时任务 等等
 */


var cluster = require('cluster');


/**
 * master 进程初始化工作
 */
if(cluster.isMaster){

    // 仅在 master 进程下执行一次





/**
 * worker 进程初始化工作
 */
}else if(cluster.isWorker){

    // 每个 worker 进程初始化一次





}




//log('框架初始化 app');