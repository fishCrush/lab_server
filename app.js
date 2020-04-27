/*
 * @Author: your name
 * @Date: 2020-04-17 22:15:01
 * @LastEditTime: 2020-04-26 10:26:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app.js
 */
require('module-alias/register')


const Koa=require('koa');
// const parser=require('koa-bodyparser'); // 处理body体/post的参数到ctx.request.body

// 利用这个插件获取上传的文件 注意：！1. koa-body不能和koa-bodyparser共用！2. koa-body中间件必须在路由中间件之前
const koaBody = require('koa-body')  

const path = require('path')
// const static = require('koa-static');//用来处理静态资源的
const InitManager=require('./core/init');
const catchError=require('./middlewares/exception');

require('@models/user');
require('@models/sms');

const app=new Koa();
app.use(koaBody({
  multipart: true,  //允许同时传多张
  formidable: {
  maxFileSize: 300 * 1024 * 1024 // 设置上传文件大小最大限制，默认3M
}
}))
app.use(catchError);
// app.use(parser());
// app.use(static(path.join(__dirname,'./static')))// static()里传入静态资源的绝对路径

InitManager.initCore(app);  // 路由组件入口放这里了

app.listen(3000);


