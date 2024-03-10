/**
 * @author: HacKer
 * @contact: 44071710@qq.com
 * @file: AntiDexLoader.js
 * @time: 2024/2/28 5:03 PM
 * @desc:Android 相关的hook_api
 */


var fridaUnpack = require('./android/unpack/fridaUnpack');
import {Anti} from "./android/Anti";
import {Call_method} from "./android/call/Call_method";
import {Jni} from "./android/jnimgr";
import {FCCommon} from "./FCCommon";
import {DMLog} from "./dmlog";
import internal from "stream";
import exp from "constants";

export namespace FCAnd {
    export var anti = Anti;
    export var jni = Jni;
    export var common = FCCommon;
    export var call = Call_method;

    /**
     * 获取调用栈
    */
    export function getStacks() {
        return Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()) + "";
    }

    /**
     * 显示调用栈
     * @description 用于显示堆栈
    */
    export function showStacks() {
        Java.perform(function () {
            DMLog.d('showStacks', '----------------------------------------------------');
            DMLog.d('showStacks', getStacks());  // 打印堆栈
            DMLog.d('showStacks', '----------------------------------------------------');
        });Process.getCurrentThreadId()
    }

    /**
     * 获取jsonobject类中getString的值
     * @param {string} pKey - 要查找的key
     * @description 打印在apk运行时所有的key,只要有用到jsonobject类
    */
    export function get_JSONObject_getString(pKey: string) {
    /*
        获取JSONObject的key值
    */
        var JSONObject = Java.use('org.json.JSONObject');

        
        JSONObject.getString.implementation = function (key: string) {
            if (key == pKey) {
                DMLog.i('get_JSONObject_getString', 'found key: ' + key);
                showStacks();
            }
            return this.getString(key);
        }
    }

    /** 
     * 获取json的key值
     * @param {string} pKey - 要查找的key
     * @returns 打印在apk运行时所有的key,只要有用到json格式
    */  
    export function get_fastJson(pKey: string) {
        // coord: (106734,0,22) | addr: Lcom/alibaba/fastjson/JSONObject; | loc: ?
        var fastJson = Java.use('com/alibaba/fastjson/JSONObject');
        fastJson.getString.implementation = function (key: string) {
            if (key == pKey) {
                DMLog.i('get_fastJson getString', 'found key: ' + key);
                showStacks();
            }
            return this.getString(key);
        };
        fastJson.getJSONArray.implementation = function (key: string) {
            if (key == pKey) {
                DMLog.i('get_fastJson getJSONArray', 'found key: ' + key);
                showStacks();
            }
            return this.getString(key);
        };
        fastJson.getJSONObject.implementation = function (key: string) {
            if (key == pKey) {
                DMLog.i('get_fastJson getJSONObject', 'found key: ' + key);
                showStacks();
            }
            return this.getString(key);
        };
        fastJson.getInteger.implementation = function (key: string) {
            if (key == pKey) {
                DMLog.i('get_fastJson getJSONObject', 'found key: ' + key);
                showStacks();
            }
            return this.getString(key);
        };
    }

    /**
     *  获取Map的key和val值
     *  @param {string} pKey - 要查找的key
     *  @param {boolean} accurately - 是否精确获取
     *  @description 打印在apk运行时所有的key和value,只要有用到Map
    */
    export function get_Map(pKey: string, accurately: boolean) {
        var Map = Java.use('java.util.Map');
        Map.put.implementation = function (key: string, val: string) {
            var bRes = false;
            if (accurately) {
                bRes = (key + "") == (pKey);
            }
            else {
                bRes = (key + "").indexOf(pKey) > -1;
            }
            if (bRes) {
                DMLog.i('map', 'key: ' + key);
                DMLog.i('map', 'val: ' + val);
                showStacks();
            }
            this.put(key, val);
        };

        var LinkedHashMap = Java.use('java.util.LinkedHashMap');
        LinkedHashMap.put.implementation = function (key1: any, val: any) {
            var bRes = false;
            if (accurately) {
                bRes = (key1 + "") == (pKey);
            }
            else {
                bRes = (key1 + "").indexOf(pKey) > -1;
            }
            if (null != key1 && bRes) {
                DMLog.i('LinkedHashMap', 'key: ' + key1);
                DMLog.i('LinkedHashMap', 'val: ' + val);
                showStacks();
            }
            return this.put(key1, val);
        };
    }

    /** 
     *   获取android日志输出
    */
    export function get_log() {
        var Log = Java.use('android.util.Log');
        Log.d.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log d', 'tag: ' + tag + ', content: ' + content);
        };
        Log.v.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log v', 'tag: ' + tag + ', content: ' + content);
        };
        Log.i.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log i', 'tag: ' + tag + ', content: ' + content);
        };
        Log.w.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log w', 'tag: ' + tag + ', content: ' + content);
        };
        Log.e.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log e', 'tag: ' + tag + ', content: ' + content);
        };
        Log.wtf.overload('java.lang.String', 'java.lang.String')
            .implementation = function (tag: string, content: string) {
            DMLog.i('Log wtf', 'tag: ' + tag + ', content: ' + content);
        };
    }

    /**
     *  获取消息框的信息
     *  @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function get_makeText(bShowStacks: boolean=false){
        var TextView= Java.use("android.widget.Toast");
        TextView.makeText.overload('android.content.Context', 'java.lang.CharSequence', 'int').implementation = function (context:any,text:String,duration:internal) {
            DMLog.i('get_makeText', 'Context: ' + context + ' text: ' + text + ' duration: ' + duration);
            if (bShowStacks) {
                showStacks();
            }
            var result = this["makeText"](context,text,duration);
            return result;
        };
    }
    
    /**
     * 获取hook的随机数
     * @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function get_random(bShowStacks: boolean=false){
        var Math = Java.use("java.lang.Math");
        Math.random.implementation = function(){
            var result = this.random();
            DMLog.i('get_random', 'random is value:' + result);
            if (bShowStacks) {
                showStacks();
            }
            return result;
        }
    }

    /**
     * 设置hook的随机数
     * @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function set_random(value:any){
        var Math = Java.use("java.lang.Math");
        Math.random.implementation = function(){
            DMLog.i('set_random', 'set random value:' + Number(value));
            // Number 将value的值转换为双精度浮点数
            return Number(value);
        }
    }

    /**
     * 获取应用程序的签名
     * @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function get_signatures(bShowStacks: boolean=false){
        var Signature = Java.use("android.content.pm.Signature");
        Signature.toByteArray.implementation = function(){
            var result = this.toByteArray(); 
            DMLog.i('get_signatures', 'signatures is bytearray:{' + result + '}');
            if (bShowStacks) {
                showStacks();
            }
            return result;
        }
    }

    /**
     * 获取字节缓冲区的容量
     * @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function get_ByteBuffer_allocate(bShowStacks: boolean=false){
        var ByteBuffer = Java.use("java.nio.ByteBuffer");
        ByteBuffer.allocate.implementation = function(capacity:any){
            DMLog.i('get_ByteBuffer_allocate', 'allocate is capacity:' + capacity + '');
            if (bShowStacks) {
                showStacks();
            }
            var result = this.allocate(capacity); 
            return result;
        }
    }
    
    /**
     * 获取字节缓存区写入的数组(暂时hook不住) 
    */
    export function get_HeapByteBuffer_array(){
        Java.choose("java.nio.HeapByteBuffer",{
            onMatch:function(ins){
                var result = ins.array();
                DMLog.i('get_HeapByteBuffer_array', ' result:' + result + '');
            },
            onComplete:function(){}
        })
    }

    /**
     * 获取字节缓冲区的写入
     * @param {boolean} bShowStacks - 是否打印堆栈
    */
    export function get_HeapByteBuffer_put(bShowStacks: boolean=false){
        // ByteBuffer 的实现类
        var HeapByteBuffer = Java.use("java.nio.HeapByteBuffer");
        HeapByteBuffer.put.overload('byte').implementation = function(b:any){
            DMLog.i('get_HeapByteBuffer_put', ' byte:' + b + '');
            if (bShowStacks) {
                showStacks();
            }
            var result = this.put(b); 
            return result;
        }   
        HeapByteBuffer.put.overload('int', 'byte').implementation = function(int:any,b:any){
            DMLog.i('get_HeapByteBuffer_put', 'int:' + int + ' byte:' + b);
            if (bShowStacks) {
                showStacks();
            }
            var result = this.put(int,b); 
            return result;
        }
        HeapByteBuffer.put.overload('[B', 'int', 'int').implementation = function(b:any,int1:any,int2:any){
            DMLog.i('get_HeapByteBuffer_put', 'byte_array:' + b + ' int1:' + int1 + ' int2' + int2);
            if (bShowStacks) {
                showStacks();
            }
            var result = this.put(b,int1,int2); 
            return result;
        }
        
    }

    /**
     * 获取某个类中变量的值
     * @param {string} cls - 类名
     * @param {string} name - 变量名
     * @param {boolean} is_static - 是否静态变量名
    */
    export function get_value(cls:string,name:string,is_static:boolean=false){
        if(is_static){
            var Class = Java.use(cls);
            DMLog.i("get_value",name + " is static value:  " + Class[name].value);
            DMLog.i("get_value",name + " is same static value:" + Class["_" + name].value);
        }else{
            Java.choose(cls, {
                onMatch: function (instance) {
                    //获取非静态成员变量的值
                    DMLog.i("get_value",name + " is value:  " + instance[name].value);
                    DMLog.i("get_value",name + " is same value:" + instance["_" + name].value);
                },
                onComplete: function () {
                }
            });
        }
    }

    /**
     * 设置某个类中变量的值
     * @param {string} cls - 类名
     * @param {string} name - 变量名
     * @param {boolean} value - 变量的值
     * @param {boolean} is_static - 是否静态变量名 
    */
    export function set_value(cls:string,name:string,value:any,is_static:boolean=false){
        if(is_static){
            var Class = Java.use(cls);
            Class[name].value = value;
            Class["_" + name].value = value;
            DMLog.i("set_value",name + " set static value:  " + Class[name].value);
            DMLog.i("set_value",name + " set same static value: " + Class["_" + name].value);
        }else{
            Java.choose(cls, {
                onMatch: function (instance) {
                    //获取非静态成员变量的值
                    instance[name].value = value;
                    instance["_" + name].value = value;
                    DMLog.i("set_value",name + " set value:  " + instance[name].value);
                    DMLog.i("set_value",name + " set same value: " + instance["_" + name].value);
                },
                onComplete: function () {
                }
            });
        }
    }

    /** 
     * 获取添加到数组的值
    */
    export function get_arraylist_add(){
        var arraylist = Java.use("java.util.ArrayList");
        arraylist.add.overload("java.lang.Object").implementation = function(a:any){
            DMLog.i("get_arraylist_add","arraylist_add value:  " + a);
            return this.add(a);
        }

        arraylist.add.overload("int","java.lang.Object").implementation = function(a:any,b:any){
            DMLog.i("get_arraylist_add","arraylist_add value:  " + a + " " + b);
            return this.add(a,b);
        }
    }

    /**
     * 判断输入是否相等
     * @description 在apk运行中如果有判断是否相等,可以hook住并打印出来
    */
    export function get_textutils_isEmpty(){
        var textutils = Java.use("android.text.TextUtils");
        textutils.isEmpty.implementation = function(a:any){
            DMLog.i("get_textutils_isEmpty","textutils_isEmpty value:  " + a);
            return this.isEmpty(a);
        } 
    }
    
    /**
     * 根据找到的类查找动态加载的dex
     * @param {string} cls - 类名
    */
    export function check_dyn_dex(cls:string){
        //hook 动态加载的dex
        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                try {
                    if (loader.findClass(cls)) {
                        console.log(loader);
                        DMLog.i("check_dyn_dex",cls + "是动态加载,需要切换dex");
        
                        // Java.classFactory.loader = loader;      //切换classloader
                    }else{
                        DMLog.i("check_dyn_dex",cls + "不是动态加载");
                    }
                } catch (error) {

                }

            }, onComplete: function () {

            }
        });
    }

    /**
    * 根据传入的方法查找对应的实现类
    * @param {string} cls - 类名
    * @param {string} method - 要查找的方法名
    * @description 这个方法常应用在查找接口类和抽象类中,方法的实现
    */
    export function find_method(cls:string,method:string){
        var Class = Java.use(cls);
        Java.choose(cls, {
            onMatch: function (instance) {
                DMLog.i("find_method","claessName : " + instance[method].$className);
            }, onComplete: function () {

            }
        });
    }


    /**
     * 旧版内存拉取(不推荐)
     * @description 从内存中拉取dex文件
    */
    export function dump_dex_common_old() {
        fridaUnpack.unpack_common();
    }

    /**
     * 新版内存拉取(推荐)
     * @description 从内存中拉取dex文件
    */
    export function dump_dex() {
        fridaUnpack.dump_dex();
    }

    /**
     * 加载so文件时机
     * @description 可以查看apk启动时加载的so文件,如果检测不在java层,可以快速定位检测调试的so文件
    */
    export function traceLoadlibrary() {
        // 低版本
        var dlopen_ptr = Module.findExportByName(null, 'dlopen');
        if (null != dlopen_ptr) {
            DMLog.i('traceLoadlibrary', 'dlopen_ptr: ' + dlopen_ptr);
            Interceptor.attach(dlopen_ptr, {
                onEnter: function (args) {
                    DMLog.i('traceLoadlibrary', 'dlopen_loadlibrary: ' + args[0].readCString());
                }
            });
        }
        else {
            DMLog.e('traceLoadlibrary', 'dlopen_ptr is null');
        }

        // 高版本
        var android_dlopen_ext = Module.findExportByName(null,"android_dlopen_ext");
        if (null != dlopen_ptr) {
            DMLog.i('traceLoadlibrary', 'android_dlopen_ext: ' + android_dlopen_ext);
            Interceptor.attach(dlopen_ptr, {
                onEnter: function (args) {
                    DMLog.i('traceLoadlibrary', 'android_dlopen_ext_loadlibrary: ' + args[0].readCString());
                }
            });
        }
        else {
            DMLog.e('traceLoadlibrary', 'android_dlopen_ext is null');
        }
    }

    /**
     * 跟踪fopen
     * @description 通常用于查看apk在加载时都打开了哪些文件
    */
    export function traceFopen() {
        var open_ptr = Module.findExportByName(null, 'fopen');
        if (null != open_ptr) {
            DMLog.i('traceFopen', 'fopen_ptr: ' + open_ptr);
            Interceptor.attach(open_ptr, {
                onEnter: function (args) {
                    DMLog.i('traceFopen', 'file_path: ' + args[0].readCString());
                }
            });
        }
        else {
            DMLog.e('traceFopen', 'fopen_ptr is null');
        }
    }

    /**
     * 写内存
     * @param {NativePointer} addr - 内存地址
     * @param {string} str - 要写入的内容
     */
    export function writeMemory(addr: NativePointer, str: string) {
        Memory.protect(addr, str.length, 'rwx');
        addr.writeAnsiString(str);
    }

    /**
     * 将 js object 转换成 Java String
     * @param res
     * @returns {any}
     */
    export function newString(res: any) {
        if (null == res) {
            return null;
        }
        var String = Java.use('java.lang.String');
        return String.$new(res);
    }

    /**
     * 获取上下文信息(常用)
    */
    export function getApplicationContext() {
        var ActivityThread = Java.use('android.app.ActivityThread');
        var Context = Java.use('android.content.Context');
        var ctx = Java.cast(ActivityThread.currentApplication().getApplicationContext(), Context);
        return ctx;
    }

    /**
     * 打印字节数组
    */ 
    export function printByteArray(jbytes: any) {
        // return JSON.stringify(jbytes);
        var result = "";
        for (var i = 0; i < jbytes.length; ++i) {
            result += " ";
            result += jbytes[i].toString(16);
        }
        return result;
    }

    /**
     * trace java methods 默认类
     */
    export var tjm_default_cls = [
        // 'E:javax.crypto.Cipher',
        // 'E:javax.crypto.spec.SecretKeySpec',
        // 'E:javax.crypto.spec.IvParameterSpec',
        // 'E:javax.crypto.Mac',
        // 'M:KeyGenerator',
        'M:Base64',
        'M:javax.crypto',
        'M:java.security',
        'E:java.lang.String',
    ];

    /**
     * trace java methods 对 java.lang.String 类中的默认白名单方法名
     */
    export var tjm_default_white_detail: any = {
        /*{ clsname: {white: true/false, methods[a, b, c]} }*/
        'java.lang.String': {white: true, methods: ['toString', 'getBytes']}
    }

    /**
     * 作为 traceJavaMethods 的别称存在
     * @param clazzes
     * @param clsWhitelist
     * @param stackFilter
     */
    export function traceArtMethods(clazzes?: null | string[], clsWhitelist?: null | any, stackFilter?: string) {
        traceJavaMethods(clazzes, clsWhitelist, stackFilter);
    }

    /**
     * java 方法追踪
     * @param clazzes 要追踪类数组 ['M:Base64', 'E:java.lang.String'] ，类前面的 M 代表 match 模糊匹配，E 代表 equal 精确匹配
     * @param clsWhitelist 指定某类方法 Hook 细则，可按白名单或黑名单过滤方法。
     *                  { '类名': {white: true, methods: ['toString', 'getBytes']} }
     * @stackFilter 按匹配字串打印堆栈。如果要匹配 bytes 数组需要十进制无空格字串，例如："104,113,-105"
     */
    export function traceJavaMethods(clazzes?: null | string[], clsWhitelist?: null | any, stackFilter?: string) {
        var dest_cls: string[] = [];
        var dest_white: any = {...tjm_default_white_detail, ...clsWhitelist};
        if (clazzes != null) {
            dest_cls = tjm_default_cls.concat(clazzes);
        }
        else {
            dest_cls = tjm_default_cls;
        }

        traceJavaMethods_custom(dest_cls, dest_white, stackFilter);
    }

    export function traceJavaMethods_custom(clazzes: string[], clsWhitelist?: null | any, stackFilter?: string) {

        function match(destCls: string, curClsName: string) {
            var mode = destCls[0];
            var ex = destCls.substr(2);
            if (mode == 'E') {
                return ex == curClsName;
            }
            else {
                return curClsName.match(ex);
            }
        }

        function sendContent(obj: any) {
            var str = JSON.stringify(obj);
            var stacks = null;
            if (null != stackFilter && str.indexOf(stackFilter) > -1) {
                stacks = getStacks();
                obj['stacks'] = stacks;
                str = JSON.stringify(obj);
            }
            send(str);
        }

        function traceJavaMethodsCore(clsname: string) {
            var cls = Java.use(clsname);
            var methods = cls.class.getDeclaredMethods();
            DMLog.i('traceJavaMethodsCore', 'trace cls: ' + clsname + ', method size: ' + methods.length);
            methods.forEach(function (method: any) {
                var methodName = method.getName();
                DMLog.i('traceJavaMethodsCore.methodname', methodName);
                var detail = null;
                if (null != clsWhitelist) {
                    detail = clsWhitelist[clsname];
                }
                if (null != detail && typeof (detail) == 'object') {
                    if ((detail.methods.indexOf(methodName) > -1) != detail.white) {
                        return true; // next forEach
                    }
                }

                if ('invoke' == methodName || 'getChars' == methodName) {
                    return true;    // 跳过并继续执行下一个 forEach
                }
                var methodOverloads = cls[methodName].overloads;
                if (null != methodOverloads) {
                    methodOverloads.forEach(function (overload: any) {
                        try {
                            overload.implementation = function () {
                                var tid = Process.getCurrentThreadId();
                                var tname = Java.use("java.lang.Thread").currentThread().getName();
                                sendContent({
                                    tid: tid,
                                    status: 'entry',
                                    tname: tname,
                                    classname: clsname,
                                    method: method.toString(),
                                    method_: overload._p[0],
                                    args: arguments
                                });
                                var retval = this[methodName].apply(this, arguments);
                                sendContent({
                                    tid: tid,
                                    status: 'exit',
                                    tname: tname,
                                    classname: clsname,
                                    method: method.toString(),
                                    retval: retval
                                });
                                return retval;
                            }
                        } catch (e) {
                            DMLog.d('overload.implementation exception: ' + overload._p[0], e!.toString());
                        }
                    });
                }
            })

            // var consOverloads = cls.$init.overloads;
            // if (null != consOverloads) {
            //     consOverloads.forEach(function (overload: any) {
            //         overload.implementation = function () {
            //             DMLog.i('traceInit_entry',  '================');
            //             var retval = this.$init(arguments);
            //             DMLog.i('traceInit_exit', '-----------------');
            //             return retval;
            //         }
            //     });
            // }
        }

        Java.enumerateLoadedClassesSync().forEach((curClsName, index, array) => {
            clazzes.forEach((destCls) => {
                if (match(destCls, curClsName)) {
                    traceJavaMethodsCore(curClsName);
                    return false; // end forEach
                }
            });
        });
    }
}
