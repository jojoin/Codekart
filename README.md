
Codekart
========

[![Build Status](https://secure.travis-ci.org/Automattic/socket.io.png)](http://travis-ci.org/Automattic/socket.io)
[![NPM version](https://badge.fury.io/js/codekart.svg)](http://badge.fury.io/js/codekart)
[![Gitter chat](https://badges.gitter.im/yangjiePro/Codekart.png)](https://gitter.im/yangjiePro/Codekart)
[![Codekart官方群](http://pub.idqqimg.com/wpa/images/group.png)](http://shang.qq.com/wpa/qunwpa?idkey=f1c376034f496a66d144e4cca4ff7beb2e2fd8aed89c5b81b3ba7a435f031e68)

**Web application framework for Node.js : [codekart.jojoin.com](http://codekart.jojoin.com/)**
 

![Codetank](http://codekart.jojoin.com/cssimg/codekart/banner.png)

[Codekart](http://codekart.jojoin.com/) 是一套给 Node.js 开发者使用的应用程序开发框架和工具包。 它提供一套丰富的标准库以及简单的接口和逻辑结构， 其目的是使开发人员更快速地进行项目开发。 框架已经完成了诸如url请求自动路由、静态文件服务器和前后端代码模块化等实用且必须的功能。使用 Codekart 可以减少代码的编写量， 并将你的精力投入到项目的创造性开发上。


##安装：

[![NPM](https://nodei.co/npm/codekart.png?downloads=true&start=true)](https://nodei.co/npm/codekart/)

```
npm install codekart
```


##链接：

[Codekart主页](http://codekart.jojoin.com/)

API文档/使用手册：http://docs.codekart.jojoin.com
此文档程序由codekart框架开发和驱动，托管地址：https://github.com/myworld4059/docs.codekart

官方QQ群：366311819 (问题解答,bug反馈,功能建议等)

本框架来自[君鉴网](http://jojoin.com/)的开发实战积累。


##详细介绍：

```
• Codekart 是一个轻量级但功能强大的 Node.js 框架， 
  让你在高性能 javascript 引擎 V8 下， 如同 PHP 一样简单而且快速地建立 web 站点。
• 它是轻量级，同时也是功能强大的。因为你只需要加载最基本的模块，
  并在你使用其他功能时按需加载，不用一次性载入臃肿而庞大的库。
• 它是零配置的。你只需要把文件拷贝至服务器目录，然后执行 node index.js ，
  一个 MVC 开发框架就启动了。
• 它是精简的。Codekart 信奉 JQuery 的设计哲学： write less do more 。
• 它是前后端一体化的。你可以像写配置文件一样编写web页面，
  我们自动帮你完成 js、css 文件的模块化加载和压缩合并，
  并自动在html里引用。自动完成html模板的解析。一切都是那么简单而富有条理。
• 集成了常用的前端控件，例如翻页和滚动插件，tip 提示框等等
```

**它已经帮你出色的完成了下面这些事情：**

1. 高性能 MVC 开发框架
2. 具备客户端缓存支持的静态文件服务器
3. view 页面、binary 二进制文件处理、api 请求等 url 路由
4. view 页面继承支持、配置生成化及模板数据解析
5. js、css、html 的模块化按需加载，并合并压缩
6. 经过提炼的常用数据处理和流程控制工具箱
7. 精简而强大的前端 js 插件和常用方法库
8. 更多强大特征


##使用示例：

使用Codekart，你可以十分方便的进行web页面模块化配置，例如: framework/view/html.js 内容如下：

```javascript
//web页面顶级页面定义
exports.stuff = {
    tpl:{html:'html'},  //页面的tpl模板文件列表，保存在 app/resource/tpl 目录下
    tplpre:[],  //待用的tpl文件列表 会被加入js文件里面待用，保存在 app/resource/tpl 目录下
                 //保存在app/view/tpl文件夹 格式{note_list:'abc/abc'}
    less:'html',  //页面的css模板文件列表，保存在 app/resource/less 目录下
    csslib:[],  //css库文件，在static/csslib目录下
    js:[
        'functions',
        'json',
        'cookie',
        'jq-extend',
        'tmpl',
        'pro'
    ], //页面的js模板文件列表，保存在 app/resource/js 目录下
    jslib: 'jquery-2.0.3.min'  //js库文件列表，在static/jslib目录下
};
 
 
var website = load.config('website');
 
/**
 * tpl模板数据获取函数
 * @param callback 返回模板数据
 */
exports.data = function(callback){
    var that = this
        , req = this.request;  //原生的request请求对象
    callback({
        title: website.name,
        time: req.time,
        website: website
    },{
        website: website
    });
};
```

exports.stuff 对象及为web页面的配置，exports.data函数为页面模板数据的获取函数。你也可以方便的进行页面的继承。

其它更多强大的功能，请查阅 [Codekart文档](http://docs.codekart.jojoin.com/)。

##其它:

如果要支持本框架的开发，欢迎提交新的代码。

##关于

```
* 这是一个开源框架，你可以任意修改和使用它（包括但不限于技术研究与分享、开源项目或者商业产品）。
* 本框架最初来自 君鉴网(http://jojoin.com) 的开发实战和积累，如今你可以在下面的地址找到它并下载和学习使用：
* ┌─────────────────────────────────────────────────────────────┐
* │    框架主页：http://codekart.jojoin.com
* │    托管地址：https://github.com/yangjiePro/Codekart
* └─────────────────────────────────────────────────────────────┘
* 也欢迎你联系本框架的作者，提出建议或者bug，进行技术交流：
* ┌─────────────────────────────────────────────────────────────┐
* │    作者：杨捷
* │    邮箱：yangjie@jojoin.com
* │    QQ ：446342398
* │    Github ：https://github.com/yangjiePro
* └─────────────────────────────────────────────────────────────┘
```

