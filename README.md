
Codekart
========

###Web application framework for Node.js
 
[![Build Status](https://secure.travis-ci.org/Automattic/socket.io.png)](http://travis-ci.org/Automattic/socket.io)
[![NPM version](https://badge.fury.io/js/codekart.svg)](http://badge.fury.io/js/codekart)
[![Gitter chat](https://badges.gitter.im/yangjiePro/Codekart.png)](https://gitter.im/yangjiePro/Codekart)

![Codetank](http://codekart.jojoin.com/cssimg/codekart/banner.png)

[Codekart](http://codekart.jojoin.com/) is a powerful Node.js framework with a very small footprint, built for Node.js coders who need a simple and elegant toolkit to create full-featured web applications. If you're a developer who lives in the real world of shared hosting accounts and clients with deadlines, and if you're tired of ponderously large and thoroughly undocumented frameworks, then Codekart might be a good fit.

[Codekart](http://codekart.jojoin.com/) 是一套给 Node.js 开发者使用的应用程序开发框架和工具包。 它提供一套丰富的标准库以及简单的接口和逻辑结构， 其目的是使开发人员更快速地进行项目开发。 框架已经完成了诸如url请求自动路由、静态文件服务器和前后端代码模块化等实用且必须的功能。使用 Codekart 可以减少代码的编写量， 并将你的精力投入到项目的创造性开发上。


##安装：

```bash
$ cd /data/website
$ npm install codekart #安装Codekart
$ mv codekart myweb #修改codekart为你的自定义名称
```

[![NPM](https://nodei.co/npm/codekart.png?downloads=true&start=true)](https://nodei.co/npm/codekart/)


##简介：

####它已经帮你出色的完成了下面这些事情：

**优雅的框架思维**

如果你需要一个真正的框架，而不是一个模块/中间件/工具箱，如果你需要简约与便捷，需要一目了然、理所当然的舒适感，那么 Codekart 将是最好的选择。

**高性能 HTTP 服务器**

Codekart处理 http 请求的性能接近原生 Node.js 代码: http.createServer()， 原因是框架只是对此函数做了简单的封装，其性能的损耗仅仅只有一个 url 正则匹配运算，路由请求处理程序。

**便捷的静态文件服务器**

把文件放入 static/ 目录下，启动Codekart，url 访问，搞定！

**web 页面模块化支持**

实际上，这是Codekart最出色的部分！它是前后端一体化的，可以像写配置文件一样编写web页面， 框架自动完成 js、css 、tpl 文件的模块化加载、合并、压缩， 并在html里引用，自动完成 html 模板的解析，并且支持页面继承和多态，一切就是那么简单轻松！

**丰富的工具箱**

Codekart准备了一系列强大的前后端工具集合，涉及进程通信，数据缓存，文件读取，文件上传，数据采集与处理，流程控制，任务计划等诸多方面。


##使用示例：

使用Codekart，你可以十分方便的进行web页面模块化配置，例如: framework/view/codekart.js 内容如下：

```javascript
//web页面定义
var stuff = {
    tpl:{body:'codekart'},  //页面的tpl模板文件列表  app/resource/tpl
    less:'codekart',  //页面的css模板文件列表  app/resource/less
};

//【继承关键代码】
//继承父级页面 和 必须给本模块加上对外接口，以便其他页面继承
exports.stuff = inheritView('html',stuff); //继承至html


//加载配置文件
//var website = load.config('website');

/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取，不调用则会一直等待不能进行下一步！！！
 * 在callback中返回的变量可以在tpl模板中使用，在这里可以进行数据库的查询等等。
 * 复杂的数据获取和运算，建议放在`app/model`中的模块中进行，在这里可以调用`load.model('model')`加载。
 */

exports.data = function(callback){
    var that = this
      , req = that.request //Node原生request对象
      , req = that.response; //Node原生response对象
      
    this.setCookie('user_id', 9999, 3600); //设置cookies
    
    //post提交表单数据处理回调
    this.formdata(function(err, fields, files){
        // @err 是否出现错误
        // @fields 表单的普通文本字段数据
        // @files 表单的文件上传
        //调用callback返回模板数据
        callback({
            title: 'Codekart',
            postdata: fields['postdata'] //提交的post数据
        });
    });
};
```

exports.stuff 对象及为web页面的配置，exports.data函数为页面模板数据的获取函数。你也可以方便的进行页面的继承。

其它更多强大的功能，请查阅 [Codekart文档](http://docs.codekart.jojoin.com/)。


##相关链接：

[Codekart主页](http://codekart.jojoin.com/)

[API文档/使用手册](http://docs.codekart.jojoin.com/)

此文档程序由Codekart 0.1开发和驱动：
[文档托管地址](https://github.com/myworld4059/docs.codekart)

官方QQ群：366311819 (问题解答,bug反馈,功能建议等)

[![Codekart官方群](http://pub.idqqimg.com/wpa/images/group.png)](http://shang.qq.com/wpa/qunwpa?idkey=f1c376034f496a66d144e4cca4ff7beb2e2fd8aed89c5b81b3ba7a435f031e68)

本框架来自[君鉴网](http://jojoin.com/)的开发实战积累。


##关于

这是一个开源框架，你可以任意修改和使用它（包括但不限于技术研究与分享、开源项目或者商业产品）。如果要支持本框架的开发，欢迎提交新的代码。

```
框架主页：http://codekart.jojoin.com
托管地址：https://github.com/yangjiePro/Codekart
```

也欢迎你联系本框架的作者，提出建议或者bug，进行技术交流：

```
作者：杨捷
邮箱：yangjie@jojoin.com
QQ ：446342398
Github ：https://github.com/yangjiePro
```

