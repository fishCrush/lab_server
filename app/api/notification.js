/*
 * @Author: your name
 * @Date: 2020-04-22 12:05:28
 * @LastEditTime: 2020-05-01 11:12:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/notification.js
 */
const Router=require('koa-router');
const router =new Router({
    prefix:"/notification"
});

const {Sequelize}=require('sequelize')
const {  sequelize } = require('../../core/db')
const { Notification } = require('@models/notification')

router.post('/querylist_by_uid',async(ctx)=>{    // 获取消息记录
    const uid=ctx.cookies.get('uid');
    try{
       const data=await Notification.findAll({
           where:{
            targetUid: uid
           },
           "order":[["created_at","DESC"]]
       })
    //    console.log('data',data)
        ctx.body={
            status_code:1,
            data
        }
        ctx.status=200
    }catch(error){
        throw error
    }
})


router.post('/read_by_nid',async(ctx)=>{    // 阅读了某条消息
    const {nid}=ctx.request.body;
    try{
      await Notification.update({
        isRead:true
          },
          {
           where:{
            nid
           }
           }
           
       )

        ctx.body={
            status_code:1,
        }
        ctx.status=200
    } catch(error){
        throw error
    }
})

module.exports=router; 
