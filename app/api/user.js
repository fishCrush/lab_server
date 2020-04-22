/*
 * @Author: your name
 * @Date: 2020-04-18 08:22:35
 * @LastEditTime: 2020-04-22 15:58:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/user.js
 */
const Router=require('koa-router');
const bcrypt=require('bcryptjs')
const Core =require('@alicloud/pop-core') //阿里云sms短信服务的sdk
const router =new Router({
    prefix:"/user"
});
const {User}=require('../models/user')
const { Sms } = require('@models/sms')
const {sms}=require('../../config/config') // 阿里云sms的接口的配置
const {HttpError}=require('../../core/http-error')
const {PHONEERROR}=require('../../const/error_code')
const {PwdError}=require('../../core/http-error')

// const {FAILURE_CODE,SUCCESS_CODE}=require('../../const/status_code')


/**
 * @description:  用户注册
 * @param {type} name password phone code
 * @return: 
 */
router.post('/register',async(ctx)=>{    // 注册登录
    const {phone,code,name,password}=ctx.request.body
    const phoner=await Sms.findOne({
      where:{
        phone,
        code
      }
    })

    if(!phoner){
      throw new HttpError('请输入正确的手机号和验证码',PHONEERROR)
    }
    
    try{
      await User.create({
        phone,
        code,
        name,
        password
      })

      ctx.body={
        status_code:1
      }
    }catch(error){
      // throw new Error('添加新用户失败')
      throw error
    }
   
})


/**
 * @description: 发送验证码
 * @param {type} 
 * @return: 
 */
router.post('/send_sms',async(ctx)=>{ 
    // const RPCClient = AliCloud.RPCClient;
    const {accessKeyId,accessKeySecret,endpoint,apiVersion,RegionId,SignName,TemplateCode}=sms;
    const client = new Core({
        accessKeyId,
        accessKeySecret,
        endpoint,
        apiVersion
      });
      
      const {phone}=ctx.request.body
      const CODEInt = parseInt(Math.random().toString().slice(-6)) // 随机生成的字符串,并进行转换，用parseInt会自动去除字符串前面的0
      const CODE=String(CODEInt)
      const params = {
        "RegionId": RegionId,
        "SignName": SignName,
        "TemplateCode": TemplateCode,
        "PhoneNumbers": phone,
        "TemplateParam": `{code: ${CODE}}`
      }

      const requestOption = {
        method: 'POST'
      };

      const result=await client.request('SendSms', params, requestOption) // 请求第三方接口，是异步的
      const {Code}=result
      if(Code==='OK'){ // 阿里云api规定的成功的返回码
              ctx.body={
                  message:'ok',
                  // status_code:SUCCESS_CODE
                  status_code:100
              }

              const {body}=ctx.request
              const {phone}=body

              const isHas=await  Sms.findOne({
                   where:{
                     phone
                   }
              })
              
              try{
                if(isHas){
                  await Sms.update({  // 若已有则修改
                    code:CODE
                  })
                } else{
                   await Sms.create({  // 若无则增加
                    phone,
                    code:CODE
                 })
                }
                
              } catch(error){
                throw error
              }
          } 

})

/**
 * @description:  修改密码
 * @param {type} name password phone code
 * @return: 
 */
router.post('/modify_pwd',async(ctx)=>{    
  const {name, oldPwd, newPwd }=ctx.request.body
  
  const userRecord=await User.findOne({
    where:{
        name
    }
 })
 const correct = bcrypt.compareSync(oldPwd,userRecord.password) // 查询用户密码是否与数据库里的一致

 if(!correct){ // 检测用户和密码是否正确
  throw new PwdError('密码出错！请重新输入正确密码')
 } 
  
  try{
    await User.update({
      password:newPwd
    },{
      where:{
        name
      }
    })

    ctx.body={
      status_code:1
    }
  }catch(error){
    // throw new Error('添加新用户失败')
    throw error
  }
 
})


module.exports=router; // 注意一定要导出路由接口，且注意是直接导出还是包裹花括号后再导出（会导致引入方式的不同）