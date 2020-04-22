/*
 * @Author: your name
 * @Date: 2020-04-19 13:22:31
 * @LastEditTime: 2020-04-22 14:49:55
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/token.js
 */
const Router=require('koa-router');
const router =new Router({
    prefix:"/token"
});
const {User}=require('../models/user')
const {TokenValidator}=require('../validator/validator');
// const {success} = require('../lib/helper')
const {LoginType}=require('../lib/enum')
const {generateToken} =require('../../core/util')

// 用户注册
// 参数: name, password1,password2
router.post('/',async(ctx)=>{  
    const v= await new TokenValidator().validate(ctx)  
    let token;
    switch(v.get('body.type')){
        case LoginType.USER_NAME:   // 101
              token = await nameLogin(v.get('body.account'),
              v.get('body.secret'))
               break;
        case LoginType.USER_MOBILE:   //102
              break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body={
        token
    }
 })

 async function nameLogin(account,secret){
   const user=await User.verifyNamePassword(account,secret)
   return  token = generateToken(user.id,2)  // 用户id, scope控制用户权限 暂时先写上2
 }




module.exports=router; // 注意一定要导出路由接口，且注意是直接导出还是包裹花括号后再导出（会导致引入方式的不同）