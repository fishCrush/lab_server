/*
 * @Author: your name
 * @Date: 2020-04-23 18:33:12
 * @LastEditTime: 2020-04-23 18:48:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/core/utils.js
 */
const fs =require('fs');

//  将文件转换为buffer 二进制数据
 function getBufferFromFile(file) {
    if (Buffer.isBuffer(file)) {
        return file;
    } else {
        return fs.readFileSync(file.path);
    }
}

module.exports={
    getBufferFromFile
}