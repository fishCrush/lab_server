/*
 * @Author: your name
 * @Date: 2020-04-21 11:54:41
 * @LastEditTime: 2020-04-24 21:11:47
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

class NoUserError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=111; // 错误码：
        this.msg=msg || '没有该注册用户，请先进行注册';
    }
}

class EmptyUploadError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=201; // 错误码：
        this.msg=msg || '没有文件上传！请重新上传文件';
    }
}

class InvalidUploadError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=202; // 错误码：
        this.msg=msg || '上传的文件是无效的！请重新上传正确填写好的文件';
    }
}


class DataEmptyUploadError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=203; // 错误码：
        this.msg=msg || '文件是空的！请重新上传正确填写好的文件';
    }
}

class RequireError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=204; // 错误码：
        this.msg=msg || '添加失败！物品的名称或数量(必填)未完全填写完整，请重新上传正确填写好的文件';
    }
}

class OssUploadError extends HttpError{
    constructor(msg){
        super()
        this.statusCode=0; // 状态码：
        this.errorCode=205; // 错误码：
        this.msg=msg || '抱歉，图片上传失败，服务器内部原因';
    }
}

module.exports={
    HttpError,
    PwdError,
    NoUserError,
    EmptyUploadError,
    DataEmptyUploadError,
    InvalidUploadError,
    RequireError,
    OssUploadError,
}

