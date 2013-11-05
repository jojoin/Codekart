/**
 *  错误页面
 */


var mop = inheritView('html'); //继承父级页面
mop.name.push('error');  //本页面名称赋值，用于递归调用 data() 函数

//tpl模板文件 id的值 必须在父级tpl内 有 <!body!> 格式的标签，在 app/stuff/tpl 目录下
mop.tpl.push(
    {id:'body',file:'error'}
);

//less样式文件，自动编译并组合成less文件，在 app/stuff/less 目录下
mop.less.push(
    'error'
);

//js文件，在 app/stuff/js 目录下
mop.js.push(
    //'error'
);


//必须给本模块加上对外接口，以便其他页面继承
exports.mop = mop;


/**
 * 页面模板数据获取
 * 可以不定义此函数，程序将跳过本页面的数据获取
 * @callback 必须调用 ，表示数据获取完成，进行子级页面数据获取
 */
exports.data = function(callback){
    callback({
        title: ':( error 程序错误'
    });
};
