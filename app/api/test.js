

/**
 * 这是api处理程序的示例文件，用于学习理解或测试，可以按照下面的格式建立新文件，编写api
 目中，你可以删掉它
 */




/**
 * 示例api
 */
exports.example = function(){
    var that = this
        , request = that.request  //request对象
        , response = that.response  //response对象
        , get = request.get    //url的get参数
        , post = request.post;  //请求的post参数

    var data = {result:'Your Response Data...'}; //返回的数据（自定义）


    /*
     * 通过调用 this.renderApi() 向客户端返回数据，为json格式的字符串：
     {
       code: 200, //自定义代码 200位返回正确
       msg: "", //消息
       data: {} //数据
     }
     */
    //调用则向客户端返回数据，并关闭连接
    that.renderApi(200,"api is ok !",data);

};
