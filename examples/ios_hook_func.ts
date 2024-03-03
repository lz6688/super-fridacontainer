/**
 * @author: HacKer
 * @contact: 44071710@qq.com
 * @file: ios_hook_func.js
 * @time: 2024/3/3 12:37 PM
 * @desc:
 */

import {FCiOS} from "../utils/FCiOS";
import {DMLog} from "../utils/dmlog";

if (ObjC.available) {
    var addr = FCiOS.getFuncAddr('*[NVEnvironment deviceId]');
    Interceptor.attach(addr, {
        onEnter: function (args) {

        },
        onLeave: function (retval) {
            retval.replace(ObjC.classes.NSString.stringWithString_('random_deviceidxxxxxxxxx'));
                // 87e041d4c2abb75fda2b2390474c993a70fcc0ff
                DMLog.d('deviceId', 'retval: ' + ObjC.classes.NSString.stringWithString_(retval));
        }
    })
}