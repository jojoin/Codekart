
var framework_this = load.core('!this');
var app_this = load.core('this');


if(app_this.__framework){
    //表示没有定义核心扩展
    app_core = null; 
}



/**
 * this本地对象
 */
module.exports = function(request, response){

    /**
     * 更新对象！
     */
    this.__init = function(request, response){
        //环境变量
        this.request = request;
        this.response = response;
        //cookie数组
        this.cookieArr = [];
        //执行扩展的 this 对象数据更新
        if(this._init){
            this._init(request, response);
        }
    }

    // 执行更新
    if(request && response){
        this.init(request, response);
    }

     
    /**
     * 框架核心功能
     */
    for(var k in framework_this){
        //log(k);
        this[k] = framework_this[k];
    }


    /**
     * 添加用户扩展核心功能
     */
    if(app_this){
        for(var k in app_this){
            //log(k);
            this[k] = app_this[k];
        }
    }



};

