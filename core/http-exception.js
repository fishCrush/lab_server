/*
 * @Author: your name
 * @Date: 2020-04-18 15:24:16
 * @LastEditTime: 2020-04-21 13:18:32
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /server/core/http-exception.js
 */
  class HttpException extends Error{ // 处理http时异常的基类
      constructor(msg="服务器异常",errorCode=10000,code=400){
          super()
          this.errorCode=errorCode;
          this.code=code;
          // 可以把status简写成code
          this.msg=msg;
      }
  }

  class ParameterException extends HttpException{
      constructor(msg,errorCode){
          super()
          this.code=400    // 通常参数错误类型的异常，其status都是400
          this.msg=msg || '参数出错'
          this.errorCode=errorCode || 10000
      }
  }

  class Success extends HttpException{  // 成功标志
    constructor(msg, errorCode){
        super()
        this.code = 201       //201 操作成功   200 查询成功
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
    }
 }

 class NotFound extends HttpException{
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10000
        this.code = 404
    }
}

class AuthFailed  extends HttpException {  // 授权登录失败
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}

class Forbbiden extends HttpException{
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}

  module.exports={
      HttpException,
      ParameterException,
      Success,
      NotFound,
      AuthFailed,
      Forbbiden
  }