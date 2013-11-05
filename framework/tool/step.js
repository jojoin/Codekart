
/**
 * 控制流处理模块
 * 作者：杨捷
 * QQ：446342398
 * email：myworld4059@163.com
 */



/**
 * 按步骤执行流程
 * 接受回调函数列表，每一个函数需要执行this.step()函数
 * 最后一个函数，则用来处理步骤完成的数据
 */
exports.Step = function(){
    var stepFuncAry = []   //步骤回调函数
        , stepDataAry = []   //步骤数据
        , stepNum = 0;
    RecursionStepFunc(arguments,stepFuncAry); //递归函数列表
    var stepFuncAryLeg = stepFuncAry.length;
    oneStep();
    //处理下一步
    function oneStep(){
        if(stepFuncAryLeg>0&&typeof stepFuncAry[stepNum]=='function'){
            var callbackThis = new stepThis(stepNum,dataBack)
                , peviData = (stepNum-1>=0)?stepDataAry[stepNum-1]:undefined  //上一步产生的数据
                , redata = stepFuncAry[stepNum].call(callbackThis,peviData,stepDataAry); //调用数据处理函数，把上一步数据，和全部数据作为参数
            if(redata!==undefined) dataBack(redata); //如果有返回值
        }
    }
    //数据返回处理函数
    function dataBack(data,ctrl){
        if(stepNum<stepFuncAryLeg&&stepDataAry[stepNum]===undefined){
            stepDataAry[stepNum] = data;
            if(ctrl=='stop'){
                stepNum=stepFuncAryLeg; //终止执行
            }else if(ctrl=='end'){
                stepNum=stepFuncAryLeg-1; //跳到最后一步
            }else{
                stepNum++;
            }
            oneStep(); //执行下一步
        }

    }
};


//外部回调函数this对象
function stepThis(index,dataBack){
    this.index = index;
    this.step = function(data){
        dataBack(data);
    };
    this.end = function(data){
        dataBack(data,'end'); //跳到最后一步
    };
    this.stop = function(){
        dataBack('','stop'); //停止执行后面所有步骤
    };
}




/**
 * 组装数据功能
 * 接受回调函数列表，每一个函数需要执行this.step()函数
 * 最后一个函数，则用来处理组装完成的数据
 */
exports.Assem = function(){
    var stepFuncAry = []   //组装回调函数
        , stepDataAry = []   //组装数据
        , stepNum = 0;
    RecursionStepFunc(arguments,stepFuncAry); //递归函数列表
    var stepFuncAryLeg = stepFuncAry.length - 1;
    for(var k=0;k<stepFuncAryLeg;k++){
        var callbackThis = new assemThis(k,dataBack)
            , redata = stepFuncAry[k].call(callbackThis); //调用数据处理函数
        if(redata!==undefined) dataBack(redata,k); //如果有返回值
    }
    //数据返回处理函数
    function dataBack(data,index){
        if(stepDataAry[index]===undefined){
            stepDataAry[index] = data;
            stepNum++;
            if(stepFuncAryLeg>=0&&stepNum==stepFuncAryLeg){
                //正式调用数据处理函数
                stepFuncAry[stepFuncAryLeg](stepDataAry);
            }
        }
    }
};


//外部回调函数this对象
function assemThis(index,dataBack){
    this.index = index;
    this.step = function(data){
        dataBack(data,index);
    }
}



/**
 * 递归一维组装回调函数
 */
function RecursionStepFunc(one,stepFuncAry){
    if(typeof one=='function') stepFuncAry.push(one);
    else if(typeof one=='object'){
        for(var k in one){
            RecursionStepFunc(one[k],stepFuncAry);
        }
    }
}


