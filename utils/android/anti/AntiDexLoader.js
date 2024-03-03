/**
 * @author: HacKer
 * @contact: 44071710@qq.com
 * @file: AntiDexLoader.js
 * @time: 2024/3/3 5:03 PM
 * @desc:
 */


/*
    内存加载dex文件
*/
function anti_InMemoryDexClassLoader(callbackfunc) {
    //  dalvik.system.InMemoryDexClassLoader
    var InMemoryDexClassLoader = Java.use('dalvik.system.InMemoryDexClassLoader');
    InMemoryDexClassLoader.$init.overload('java.nio.ByteBuffer', 'java.lang.ClassLoader')
        .implementation = function (buff, loader) {
        this.$init(buff, loader);
        var oldcl = Java.classFactory.loader;
        Java.classFactory.loader = this;
        callbackfunc();
        Java.classFactory.loader = oldcl;

        return undefined;
    }
} 





exports.anti_InMemoryDexClassLoader = anti_InMemoryDexClassLoader;
