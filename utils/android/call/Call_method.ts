import {DMLog} from "../../dmlog";

export namespace Call_method {

    
    /*
        主动调用方法
        cls:类名
        m:方法名
        args:参数列表
        is_static:是否是静态方法
    */
    export function set_method(cls:string,m:string,args:any[],is_static:boolean=false){
        if(is_static){
            const Class=Java.use(cls);
            Class[m].apply(null,args);
        }else{
            Java.choose(cls,{    //要hook的类
                onMatch:function(instance){
                    DMLog.i("set_method","return " + instance[m].apply(this,args)); //要hook的方法
                },
                onComplete:function(){
                }
            });
        }
    }

    //主动调用构造方法
    export function set_init(cls:string,args:any[]){
        var ret:any;
        Java.choose(cls,{    //要hook的类
            onMatch:function(instance){
                // 通过apply 将args数组传递给init初始化函数
                ret=instance.$init.apply(this,args); //要hook的方法
            },
            onComplete:function(){
                DMLog.i("set_init","return: " + ret)
            }
        });
    }



}