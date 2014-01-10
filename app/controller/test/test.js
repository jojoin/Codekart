



exports.text = function(){
    var that = this;


    that.renderApi(200,'asdfg');
};


exports.get_uid = function(){
    var that = this
        , req = this.request;

    //that.render(123);
   that.render(req.url.key.uid); //返回url参数
};