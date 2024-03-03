// byte数组可视化
function jhexdump(array){
    // 开辟内存空间
    var ptr = Memory.alloc(array.length)
    for(var i = 0;i<array.length; ++i){
        // 将输出存放至内存空间
        Memory.writeS8(ptr.add(i),array[i]);
    }
    return hexdump(ptr,{offset:0,length:array.length,header:false,ansi:false});
}


/*
     * check className & filter
    */
function checkClass(name) {
    // 是否以com.开头
    if (name.startsWith("com.")
        || name.startsWith("cn.")
        || name.startsWith("io.")
        || name.startsWith("org.")
        || name.startsWith("android")
        || name.startsWith("kotlin")
        || name.startsWith("[")
        || name.startsWith("java")
        || name.startsWith("sun.")
        || name.startsWith("net.")
        || name.indexOf(".") < 0
        || name.startsWith("dalvik")

    ) {
        return false;
    }
    return true;
}

/*
     查找是否使用了okhttp3
*/
function okhttp3_find(){
    // 加载dex
    Java.openClassFile("/data/local/tmp/dex/okhttpfind.dex").load();
    var ArraysWapper = Java.use("java.util.Arrays");
    var ArrayListWapper = Java.use("java.util.ArrayList");
    var clazzNameList = Java.enumerateLoadedClassesSync();
    var isSupport = false;
    var clz_Protocol = null;
    try {
        if (clazzNameList.length == 0) {
            console.log("ERROR >> [enumerateLoadedClasses] return null !!!!!!")
            return
        }
        for (var i = 0; i < clazzNameList.length; i++) {
            var name = clazzNameList[i]
            if (!checkClass(name)) {
                continue
            }
            try {
                // 加载类
                var loadedClazz = Java.classFactory.loader.loadClass(name);
                // 是否枚举类型
                if (loadedClazz.isEnum()) {
                    var Protocol = Java.use(name);
                    console.log(ArraysWapper.toString);
                    var toString = ArraysWapper.toString(Protocol.values());
                    if (toString.indexOf("http/1.0") != -1
                        && toString.indexOf("http/1.1") != -1
                        && toString.indexOf("spdy/3.1") != -1
                        && toString.indexOf("h2") != -1
                    ) {
                        clz_Protocol = loadedClazz;
                        break;
                    }
                }
            } catch (error) {
            }
        }
        if (null == clz_Protocol) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~ 寻找okhttp特征失败，请确认是否使用okhttp ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            return
        }
        //enum values >> Not to be confused with!
        //getPackage() 用于返回表示该类所在包的 Package 对象
        //getName() 用于返回表示包名的字符串。
        // 获取包名
        var okhttp_pn = clz_Protocol.getPackage().getName();
        var likelyOkHttpClient = okhttp_pn + ".OkHttpClient"
        try {
            var clz_okclient = Java.use(likelyOkHttpClient).class
            if (null != clz_okclient) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 未 混 淆 (仅参考)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                isSupport = true;
            }
        } catch (error) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 被 混 淆 (仅参考)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            isSupport = true;
        }

    } catch (error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~未使用okhttp~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        isSupport = false;
    }

    if (!isSupport) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~ 寻找okhttp特征失败，请确认是否使用okhttp ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        return
    }

    // 创建数组列表
    var likelyClazzList = ArrayListWapper.$new()
    for (var i = 0; i < clazzNameList.length; i++) {
        var name = clazzNameList[i]
        if (!checkClass(name)) {
            continue
        }
        try {
            // 加载类
            var loadedClazz = Java.classFactory.loader.loadClass(name);
            // 将这个类添加到数组列表
            likelyClazzList.add(loadedClazz)
        } catch (error) {
        }
    }

    // 数组列表大小
    console.log("likelyClazzList size :" + likelyClazzList.size())
    if (likelyClazzList.size() == 0) {
        console.log("Please make a network request and try again!")
    }

    console.log("")
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Start Find~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("")
    try {
        var OkHttpFinder = Java.use("com.singleman.okhttp.OkHttpFinder")
        OkHttpFinder.getInstance().findClassInit(likelyClazzList)

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Find Result~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

        var OkCompatClazz = Java.use("com.singleman.okhttp.OkCompat").class
        var fields = OkCompatClazz.getDeclaredFields();
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i]
            field.setAccessible(true);
            var name_1 = field.getName()
            var value = field.get(null)
            console.log("var " + name_1 + " = \"" + value + "\";")
        }
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Find Complete~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    } catch (error) {
        console.log(error)
        //console.log(Java.use("android.util.Log").getStackTraceString(error))
    }
}


/*
    导出函数
*/
exports.jhexdump = jhexdump;
exports.okhttp3_find = okhttp3_find;