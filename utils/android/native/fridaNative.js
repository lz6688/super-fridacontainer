
/*
    设置比较的两个字符串值
*/
function set_strstr(str1=undefined,str2=undefined,ret=undefined){
    var addr_close = Module.findExportByName(null,"strstr");
    Interceptor.attach(addr_close,{
        onEnter:function(args){
            // args[1]
            // console.log("args0",ptr(args[0]).readCString());
            // console.log("args1",ptr(args[1]).readCString());
            // Memory.writeUtf8String(args[1], "");

            
            if (str1 != undefined){
                // 修改第一个参数的值
                args[0] = Memory.allocUtf8String(str1);
            }
            if (str2 != undefined){
                // 修改第二个参数的值
                args[1] = Memory.allocUtf8String(str2);
            }
            
        },
        onLeave:function(retval){
            // console.log("strstr return ",retval)
            if (ret != undefined){
                retval.replace(ret);
            }
        }
    })
}

/*
    获取RegisterNatives函数的传参和返回值
    这个函数是JNI动态注册必用的
    offset:传一个RegisterNatives的偏移地址
    module:传一个so名称

    RegisterNatives第一个参数是native函数所在的类
*/

// function get_registernatives(module,offset){
//     var ret = {}
//     var libnative_addr = Module.findBaseAddress(module);
//     var stringfromjni = libnative_addr.add(offset);
//     Interceptor.attach(stringfromjni,{
//         onEnter:function(args){

//         },
//         onLeave:function(retval){}
//     })
// }


/*
    
*/

