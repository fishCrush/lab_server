/*
 * @Author: your name
 * @Date: 2020-04-18 08:22:35
 * @LastEditTime: 2020-05-05 12:04:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/user.js
 */
const Router=require('koa-router');
const bcrypt=require('bcryptjs')
const Uuid=require('uuid')
const Core =require('@alicloud/pop-core') //阿里云sms短信服务的sdk
const router =new Router({
    prefix:"/user"
});
const {User}=require('../models/user')
const { Sms } = require('@models/sms')
const { Lab } = require('@models/lab')

const {sms}=require('../../config/config') // 阿里云sms的接口的配置
const {HttpError,NoUserError,PwdError}=require('../../core/http-error')
const {PHONEERROR}=require('../../const/error_code')

// const {FAILURE_CODE,SUCCESS_CODE}=require('../../const/status_code')
/**
 * @description:  当前用户
 * @param {type} name password phone code
 * @return: 
 */
router.post('/user_now',async(ctx)=>{  
  try{
      const uid = ctx.cookies.get('uid');
      const userRecord =await User.findOne({
        where:{
          uid
        },
        attributes:["name","uid"]
      })
      ctx.body={
      status_code:1,
      data:userRecord
      }
     ctx.status=200

  } catch(error){
    throw error
  }
})



/**
 * @description:  用户注册
 * @param {type} name password phone code
 * @return: 
 */
router.post('/register',async(ctx)=>{    
    const {phone,code,name,password}=ctx.request.body
    // console.log("phone,code,name,password",phone,code,name,password)
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
      const isHas= await User.findOne({
        where:{phone,name}
      })
      if(isHas){
         ctx.body={
           status_code:0,
           error_code:102 , // 该用户已经注册过
           msg:"你已经注册过，请进行登录"
         }
         ctx.status=200
         return false
      }
      const uid=Uuid.v1()
      await User.create({
        uid,
        phone,
        code,
        name,
        password
      })
      ctx.cookies.set('uid', uid, {  expires: new Date('2020-06-15'),});   //maxAge：cookie有效时长,单位:毫秒数 这里是2个小时

      ctx.body={
        status_code:1
      }
      ctx.status=200
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
    const {body}=ctx.request
    const phone=String(body.phone)
    const {accessKeyId,accessKeySecret,endpoint,apiVersion,RegionId,SignName,TemplateCode}=sms;
    const client = new Core({
        accessKeyId,
        accessKeySecret,
        endpoint,
        apiVersion
      });
      
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
        method: 'POST',
        timeout: 6000, //设置请求限时
      };

      try{
        const result=await client.request('SendSms', params, requestOption) // 请求第三方接口，是异步的
        const {Code}=result
        if(Code==='OK'){ // 阿里云api规定的成功的返回码
            ctx.body={
                message:'ok',
                // status_code:SUCCESS_CODE
                status_code:1
            }
            const isHasPhoner=await Sms.findOne({
                  where:{ phone }
            })
            // console.log("isHasPhoner",isHasPhoner)
            if(isHasPhoner){
              // console.log("进来已有了！！")
              await Sms.update({  // 若已有则修改
                code:CODE
              },{   where:{ phone }  })
            } else
            {
              //  console.log("进来没有的判断里了！！")
               await Sms.create({  // 若无则增加
                phone,
                code:CODE
              })
            }
        }

      } catch(error){
            throw error
      }
})

/**
 * @description: 登录
 * @param {type} 
 * @return: 
 */
router.post('/login',async(ctx)=>{    // 登录
  // console.log("header",ctx.request.header)
    const {name,password}=ctx.request.body
    // console.log("name,password",name,password)
    try{
    const user=await User.findOne({
      where:{
        name
      }
    })
    if(!user){
      throw new NoUserError()
    }

    const correct = bcrypt.compareSync(password,user.password) // 查询用户密码是否与数据库里的一致
    if(!correct){
      throw new PwdError()  
    }
    
    const {uid}=user    // 注册或者登陆都需要设置cookie
    ctx.cookies.set('uid', uid, {  expires: new Date('2020-06-15')});   //maxAge：cookie有效时长,单位:毫秒数 这里是20个小时
    ctx.body={
      status_code:1
    }
    ctx.status=200

    }catch(error){
      throw error
    }
   
})

/**
 * @description:  修改密码
 * @param {type} name password phone code
 * @return: 
 */
router.post('/modify_pwd',async(ctx)=>{    
  // console.log("等着获取cookie某个字段的值~~~~~~~~~")
  // console.log("age",ctx.cookies.get('name'))
  const uid=ctx.cookies.get('uid')
  const { oldPwd, newPwd }=ctx.request.body
  try{
    const userRecord=await User.findOne({
      where:{
        uid
      }
   })
  //  console.log("userRecord",userRecord);
    const correct = bcrypt.compareSync(oldPwd,userRecord.password) // 查询用户密码是否与数据库里的一致

    if(!correct){ // 检测用户和密码是否正确
      throw new PwdError('原密码出错！请重新输入正确密码')
    } 
    await User.update({
      password:newPwd
    },{
      where:{
          uid
      }
    })

    ctx.body={
      status_code:1
    }
    ctx.status=200
  }catch(error){
    // throw new Error('添加新用户失败')
    throw error
  }
 
})

/**
 * @description:  所有用户名和实验室名
 * @param {type} name password phone code
 * @return: 
 */
router.post('/user_lab_all_name',async(ctx)=>{  
   try{
    const userRecords=await User.findAll()
    const labRecords=await Lab.findAll()
    const usersName=userRecords.map(item=>item.name)
    const labsName=labRecords.map(item=>item.lid)
    ctx.body={
      status_code:1,
      data:{
        usersName,labsName
      }
    }
    ctx.status=200
  } catch(error){
    throw error
  }

})


module.exports=router; // 注意一定要导出路由接口，且注意是直接导出还是包裹花括号后再导出（会导致引入方式的不同）