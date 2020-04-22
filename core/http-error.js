/*
 * @Author: your name
 * @Date: 2020-04-21 11:54:41
 * @LastEditTime: 2020-04-22 14:45:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/core/http-error.js
 */

class HttpError extends Error{ // 处理http时异常的基类
    constructor(msg,errorCode){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=errorCode; // 错误码：
        this.msg=msg || '操作失败';
    }
}

class PwdError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=110; // 错误码：
        this.msg=msg || '密码出错！请重新输入正确密码';
    }
}

module.exports={
    HttpError,
    PwdError
}

