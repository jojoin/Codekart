
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

    this.request = request;
    this.response = response;
     
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

