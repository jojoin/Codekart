

//全局框架包

var path = require('path');

exports.mop = {
    name:[path.basename(__filename,'.js')], //当前文件名
    tpl:[{file:'html'}],  //{replase:[abc:'efg']}  替换字符串！！！
    tpls:[],  //待用的tpl  保存在js文件里面 {name:'note_list',file:'abc/abc'}
    less:['html'],
    csslib:[],  //css库文件，在static/csslib目录下
    js:[
        'functions',
        'json',
        'cookie',
        'jq-extend',
        'tmpl',
        'pro'
    ],
    jslib:[
        //'jquery-2.0.3.min'
    ]
};

//数据获取函数
exports.data = function(callback){
    var that = this
        , req = this.request;
    callback({
        title: config.site.name,
        time: req.time
    },{
        config: config.site
    });
};