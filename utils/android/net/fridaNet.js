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

exports.jhexdump = jhexdump;