/*
 * @Author: your name
 * @Date: 2020-04-18 14:33:36
 * @LastEditTime: 2020-04-21 13:20:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/middlewares/exception.js
 */
const {HttpException} =require('../core/http-exception')
const {HttpError}=require('../core/http-error')
const  catchError=async(ctx,next)=>{
    try{
      await next()
    } catch(error){  // 捕捉到异常后，需把有用的异常信息返回给客户端
        // const isHttpException=error instanceof HttpException; 
        const isDev=global.config.environment==='dev'
        const isHttpError=error instanceof HttpError; 

        if(isDev && !isHttpError){ // 开发环境且为未知异常下需要把异常抛出，显示到终端
            throw error;
        }

        if(isHttpError){ // 经业务处理的已知错误
            ctx.body={
                status_code:0,
                msg:error.msg,
                error_code:error.errorCode,
                // request:`${ctx.method} ${ctx.path}`
            }
            ctx.status=400
        } else{  
            // 处理未知异常  返回信息的也需与已知异常的一样 只不过内容统一
            ctx.body={
                status_code:0,
                msg:'服务端内部发生了未知错误，抱歉',
                error_code:999, //一般给定很特殊的错误码
                // request:`${ctx.method} ${ctx.path}`
            }
            ctx.status=500 //未知异常的状态码一般是500，表示服务端内部错误
        }

        // if(isHttpException){ // 处理已知异常
        //     ctx.body={
        //         msg:error.msg,
        //         error_code:error.errorCode,
        //         request:`${ctx.method} ${ctx.path}`
        //     }
        //     ctx.status=error.code
        // } else{  
        //     // 处理未知异常  返回信息的也需与已知异常的一样 只不过内容是自定义的
        //     ctx.body={
        //         msg:'服务端内部发生了未知错误，抱歉',
        //         error_code:999, //一般给定很特殊的错误码
        //         request:`${ctx.method} ${ctx.path}`
        //     }
        //     ctx.status=500 //未知异常的状态码一般是500，表示服务端内部错误
        // }
    }
}

module.exports=catchError;