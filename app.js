require('module-alias/register')


const Koa=require('koa');
const parser=require('koa-bodyparser'); // 处理body体/post的参数到ctx.request.body
const path = require('path')
const static = require('koa-static');//用来处理静态资源的
const InitManager=require('./core/init');
const catchError=require('./middlewares/exception');

require('@models/user');
require('@models/sms');

const app=new Koa();
app.use(catchError);
app.use(parser());
app.use(static(path.join(__dirname,'./static')))// static()里传入静态资源的绝对路径

InitManager.initCore(app);






















app.listen(3000);


