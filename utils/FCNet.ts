/**
 * @author: HacKer
 * @contact: 44071710@qq.com
 * @file: FCNet.js
 * @time: 2024/3/3 12:39 PM
 * @desc: 网络相关的hook_api
 */


var fridaNet = require('./android/net/fridaNet');
import {DMLog} from "./dmlog";
import { FCAnd } from "./FCAnd";


export namespace FCNet {
    /**
    * 获取url_1
    * @description 获取apk打开一个url的方式之一
    */
    export function get_url(bShowStacks: boolean = false) {
        // java.net.URL;
        var URL = Java.use('java.net.URL');
        URL.$init.overload('java.lang.String').implementation = function (url: string) {
            DMLog.i('get_url', 'url: ' + url);
            if (bShowStacks) {
                FCAnd.showStacks();
            }
            return this.$init(url);
        }
    }

    /**
    * 获取uri
    * @description 获取apk打开一个url的方式之一
    */
    export function get_uri(bShowStacks: boolean = false) {
        // android.net.Uri
        // 打印url
        var Uri = Java.use('android.net.Uri');
        Uri.parse.implementation = function (str: string) {
            DMLog.i('get_uri', 'str: ' + str);
            if (bShowStacks) {
                FCAnd.showStacks();
            }
            return this.parse(str);
        }
    }

    /**
     *获取请求头参数
    */
    export function get_requestProperty(bShowStacks: boolean = false){
        var className = null;
        var URL = Java.use('java.net.URL');
        URL.c.overload().implementation = function () {
            // DMLog.i('get_requestProperty', 'url: ' + url);
            var result = this.get_requestProperty();
            className = result.$className
            if (bShowStacks) {
                FCAnd.showStacks();
            }
            
            return result;
        }

        if(className != null){
            var HttpURLConnectionImol = Java.use(className);
            HttpURLConnectionImol.setRequestProperty.implementation = function(key:any,value:any){
                var result = this.setRequestProperty(key,value)
                DMLog.i('get_requestProperty', 'setRequestProperty key:' + key + ' value:' + value);
                return result;
            }
        }
    }


    /*
        MAC地址/ARP讨论的是链路层
        IP地址/路由器讨论的是网络层
        连接某个端口讨论的是传输层
        发送数据的内容讨论的是应用层
    */

    /**
     * 获取写入socket的信息
    */
    export function get_socket_write(is_ssl:boolean=true){
        var SocketOutputStream = undefined;
        // 选择获取的是加密ssl协议还是未加密协议
        if(is_ssl){
            SocketOutputStream = Java.use('com.android.org.conscrypt.ConscryptFileDescriptorSocket$SSLOutputStream');
        }else{
            SocketOutputStream = Java.use('java.net.SocketOutputStream');
        }
        SocketOutputStream.write.overload('[B','int','int').implementation = function(b:any,off:any,len:any){
            DMLog.i('get_socket', 'socket_write b: ' + b + ' off: ' + off + ' len: ' + len);
            DMLog.i('get_socket','hex array value: ' + fridaNet.jhexdump(b));
            var result = this.write(b,off,len);
            DMLog.i('get_socket','return value: ' + result);
            return result
        }
    }

    /**
     * 获取读取socket的信息
     * @param {boolean} is_ssl - 是否ssl封装
    */
    export function get_socket_read(is_ssl:boolean=true){
        var SocketInputStream = undefined;
        // 选择获取的是加密ssl协议还是未加密协议
        if(is_ssl){
            SocketInputStream = Java.use('com.android.org.conscrypt.ConscryptFileDescriptorSocket$SSLInputStream');
        }else{
            SocketInputStream = Java.use('java.net.SocketInputStream');
        }
         
        SocketInputStream.read.overload('[B','int','int').implementation = function(b:any,off:any,len:any){
            DMLog.i('get_socket_read', 'socket_write b: ' + b + ' off: ' + off + ' len: ' + len);
            DMLog.i('get_socket_read','hex array value: ' + fridaNet.jhexdump(b));
            var result = this.read(b,off,len);
            DMLog.i('get_socket_read','return value: ' + result);
            return result
        }
    }


    /**
     * 获取ip地址和端口
     * @description 只要有网络请求就能hook住,并打印出对应的ip和端口
    */
    export function get_ip_and_port(bShowStacks: boolean=false){
        var InetSocketAddress = Java.use('java.net.InetSocketAddress');
        // 构造方法
        InetSocketAddress.$init.overload('java.net.InetAddress','int').implementation = function(addr,port){
            // 区分本地地址还是远程地址
            if(addr.isSiteLocalAddress()){
                DMLog.i('get_Address', 'Local address: ' + addr.toString() + ' port is: ' + port);
            }else{
                DMLog.i('get_Address', 'Server address: ' + addr.toString() + ' port is: ' + port);
            }
            if (bShowStacks) {
                FCAnd.showStacks();
            }

            var result = this.$init(addr,port);
            return result;
        }
    }

    /*
        okhttp的newCall
    */
    export function get_okhhtp3_newcall(){
        var OkHttpClient = Java.use('okhttp3.OkHttpClient')
        OkHttpClient.newCall.implementation = function(request:any){
            var result = this.newCall(request)
            DMLog.i('get_okhhtp3_newcall', 'newcall args: ' + request.toString());
            return result
        }
    }

    /**
    * 调用okhttp的Inteceptor
    * @description Inteceptor是一个拦截器,利用加载dex的形式
    * @description okhttp3logging.dex在utils/dex目录下
    * @description 需要先将okhttp3logging.dex推送到/data/local/tmp/下
    * @description 日志输出用logcat看
    */
    export function call_okhttp3_Inteceptor(){
        //加载目标dex
        Java.openClassFile("/data/local/tmp/okhttp3logging.dex").load();

        var MyInterceptor = Java.use("com.r0ysuse.okhttp3demo.LoggingInterceptor");

        // 创建对象
        var MyInterceptorObj = MyInterceptor.$new()
        // 利用建造者模式在Inteceptor中添加自定义链
        var Builder = Java.use("okhttp3.OkHttpClient$Builder");
        DMLog.i('call_okhttp3_Inteceptor', 'Builder obj status :' + Builder);
        Builder.build.implementation = function(){
            this.networkInterceptors().add(MyInterceptorObj);
            return this.build();
        }
        DMLog.i('call_okhttp3_Inteceptor', 'hook_okhttp3 status Success...');
    }


    /**
    * 查找是否使用okhttp3库
    */
    export function okhttp3_find(){
        fridaNet.okhttp3_find();    
    }
 
    /**
    * 获取webview加载的url
    */
    export function get_webview_loadurl(){
        var WebView = Java.use("android.webkit.WebView");
        WebView.loadUrl.overload("java.lang.String").implementation = function (url:String) {
            DMLog.i("get_webview_loadurl","loadurl:" + url);
            this.loadUrl(url);
        }
    }

    /**
     * 获取socket所有信息
    */
    export function get_socket_all(){
        get_socket_write()
        get_socket_read()
        get_ip_and_port()
    }

    /**
    * 获取本模块url所有信息
    */
    export function get_url_all(){
        get_url();
        get_uri();
    }

}