/**
 * @author: HacKer
 * @contact: 44071710@qq.com
 * @file: AntiDexLoader.js
 * @time: 2024/2/27 5:03 PM
 * @desc:
 */
import {DMLog} from "./utils/dmlog";
import {FCCommon} from "./utils/FCCommon";
// import {DianPing} from "./agent/dp/dp";
import {FCAnd} from "./utils/FCAnd";
import {FCNet} from "./utils/FCNet";

function main() {   
    DMLog.d('MAIN', 'HELLO FridaContainer, please add code on the index.ts');
    // FCAnd.get_random();
    // FCAnd.set_random(0.005);
    // FCAnd.get_signatures();
    // FCAnd.get_ByteBuffer_allocate();
    // FCAnd.get_HeapByteBuffer_put();
    // FCAnd.traceLoadlibrary()
    // FCAnd.dump_dex();
    // FCNet.get_url_all();
    // FCNet.get_socket_all();
    FCNet.get_ip_and_port();
}

/*
    主动调用
*/
function call_main(){
}

/*
    android使用
*/
if (Java.available) {
    DMLog.i("JAVA", "available");
    Java.perform(function () {
        main();
        call_main();
    });
}

/*
    iphone使用
*/
if (ObjC.available) {
    DMLog.i("ObjC", "available");
    FCCommon.printModules();
    FCCommon.dump_module("Hopper Disassembler v4", "/Users/dmemory/Downloads/");
}


