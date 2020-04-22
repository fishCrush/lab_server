/*
 * @Author: your name
 * @Date: 2020-04-21 15:49:51
 * @LastEditTime: 2020-04-22 23:37:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/lab.js
 */
const Router=require('koa-router');
const bcrypt=require('bcryptjs')
const Uuid=require('uuid')  //用来生成随机的唯一标志字符串 
const {Sequelize}=require('sequelize')
const {  sequelize } = require('../../core/db')
const { Lab } = require('@models/lab')
const { UserLab } = require('@models/user_lab')
const {User}=require('@models/user')
const {Notification}=require('@models/notification.js')

const router =new Router({
    prefix:"/lab"
});
const {PwdError}=require('../../core/http-error')
// const {PHONEERROR}=require('../../const/error_code')
router.post('/create',async(ctx)=>{    // 创建一个新的实验室
        const justParams=ctx.request.body; // justParams表示参数是刚刚好符合数据表记录字段的，不用处理参数，直接传入
        // console.log(JSON.stringify(justParams));
        const {admin,name}=ctx.request.body;
        try{
            sequelize.transaction(async t => {
                await Lab.create(
                    justParams, 
                    {
                    transaction: t
                     }
                )
                await UserLab.create(
                    {uid:admin,lid:name},
                    {
                    transaction: t
                     }
                )
            })
    
            ctx.body={
                status_code:1
            }
            ctx.status=400
        }catch(error){
            throw error
        }
        
        
})

router.post('/modify_base',async(ctx)=>{    // 修改实验室的基本信息：位置和备注
    const {lid,remark,position}=ctx.request.body;
    const newObj={}
    if(remark){
        newObj["remark"]=remark
    }
    if(position){
        newObj["position"]=position
    }

    try{
        
        await Lab.update(newObj,{
            where:{ name:lid }
        })
 
        ctx.body={
            status_code:1
        }
        ctx.status=400
    }catch(error){
        throw error
    }
})

router.post('/list_admin',async(ctx)=>{    // 用户作为超管的所有实验室
            const {admin}=ctx.request.body; 
            try{
            const data = await Lab.findAll({
                    where:{
                        admin
                    }
                })

              ctx.body={
                  status_code:1,
                  data,
              }
              ctx.status=400
            } catch(error){
                throw error
            }
 })

 router.post('/querylabs_by_lids',async(ctx)=>{    // 通过多个lid查询多个实验室信息
    const {lidList}=ctx.request.body; 
    try{
    const data = await Lab.findAll({
            where:{
                name:{
                    [Sequelize.Op.in]: lidList
                }
            }
        })

      ctx.body={
          status_code:1,
          data,
      }
      ctx.status=400
    } catch(error){
        throw error
    }
})


router.post('/querylab_by_lid',async(ctx)=>{    // 通过lid查询某个实验室信息
    const {lid}=ctx.request.body; 
    try{
    const data = await Lab.findAll({
            where:{
                name:lid
            }
        })

      ctx.body={
          status_code:1,
          data,
      }
      ctx.status=400
    } catch(error){
        throw error
    }
})

router.post('/modify_admin',async(ctx)=>{    // 修改超管
    const {lid,targetUid,originUid,password}=ctx.request.body; // uid是目标用户 ouid是当前操作执行者
      try{
         
        const userRecord=await User.findOne({
            where:{
                name:originUid
            }
         })
        const correct = bcrypt.compareSync(password,userRecord.password) // 查询用户密码是否与数据库里的一致
        if(!correct){ // 检测用户和密码是否正确
            throw new PwdError('密码出错！请重新输入正确密码')
         } 
         
        sequelize.transaction(async t => {
                await Lab.update(      // 修改实验室的超管
                    {
                        admin:targetUid
                    },{
                       where:{
                           name:lid,
                       },
                       transaction: t
                   })
                   
                const nid=Uuid.v1()  // 随机生成的唯一标志字符串作为nid
                await Notification.create(  // 增加通知记录
                    {   
                        nid,
                        originUid,
                        targetUid,
                        lid,
                        actionType:"add",
                        identityType:"admin"
                    },
                    { transaction: t }
                )
                
                const isExist=await UserLab.findOne({  //查看用户是否已经是该实验室的管理员
                    where:{
                        uid:targetUid,
                        lid
                    }
                })
                // console.log('isExist',isExist) // 注意：isExist的值不会是布尔值，而是查找回来的记录。这样命名只是出于业务需求
                if(!isExist){
                    await UserLab.create({   // 若用户本来不是实验室的管理员之一，则增加
                        uid:targetUid,
                        lid
                     }, {  transaction: t   }
                    )
                }
                
            })
    
            ctx.body={
                status_code:1
            }
            ctx.status=400
    }catch(error){
        throw error
    }
    
})

 router.post('/list_host',async(ctx)=>{    // 用户作为普通管理员的所有实验室
            const {uid}=ctx.request.body; 
            try{
               const labRecords = await UserLab.findAll({
                    where:{
                        uid
                    }
                })
                // console.log('hhhh labRecords',JSON.stringify(labRecords))

                const lidList=labRecords.map(item=>item.lid)
                // console.log('hhhh lidList',lidList)
                
                data = await Lab.findAll({
                    where:{
                        name:{
                            [Sequelize.Op.in]: lidList
                        }
                    }
                })

              ctx.body={
                  status_code:1,
                  data,
              }
              ctx.status=400
              
            } catch(error){
                throw error
            }
 })



router.post('/add_host',async(ctx)=>{    // 增加管理员；没有数据返回，只返回状态码
    const {uidList,lid,originUid}=ctx.request.body; 
    try{
        uidList.map(async(targetUid)=>{
            sequelize.transaction(async t => {
                const isHas=await UserLab.findOne({ 
                    where:{
                        uid:targetUid,
                        lid
                    },
                })
               if(!isHas){
                  await UserLab.create({   //增加加管理员 增加用户实验室映射记录
                       uid:targetUid,
                       lid
                    },
                    { transaction: t }
                 )

                const nid=Uuid.v1()  // 随机生成的唯一标志字符串作为nid
               await Notification.create({   // 增加消息记录
                    nid,
                    originUid,
                    targetUid,
                    lid,
                    actionType:"add",
                    identityType:"host"
               }, { transaction: t }
               )
               }
            })
       })
   
         ctx.body={
             status_code:1,
         }
         ctx.status=400
    } catch(error){
        throw error
    }
    
 
    // const {uid,lid}=ctx.request.body; 
    // try{
    // const data = await UserLab.create({
    //     uid,
    //     lid
    // })

    //   ctx.body={
    //       status_code:1,
    //       data,
    //   }
    //   ctx.status=400
    // } catch(error){
    //     throw error
    // }
})

router.post('/delete_host',async(ctx)=>{    // 删除管理员；没有数据返回，只返回状态码
    const {uidList,lid,originUid}=ctx.request.body; 
    try{
        uidList.map(async(targetUid)=>{
            sequelize.transaction(async t => {
                const isHas=await UserLab.findOne({ 
                    where:{
                        uid:targetUid,
                        lid
                    },
                })

               if(isHas){
                const nid=Uuid.v1()  // 随机生成的唯一标志字符串作为nid
                await Notification.create({  //通知增加记录
                  nid,
                  originUid,
                  targetUid,
                  lid,
                  actionType:"delete",
                  identityType:"host"
                 },  { transaction: t }
               )
                await UserLab.destroy({   //删除管理员 删除用户实验室映射记录
                       where:{
                           uid:targetUid,
                           lid
                       }
                    },
                    { transaction: t }
                 )
               }

            })
           
       })
   
         ctx.body={
             status_code:1,
         }
         ctx.status=400
    } catch(error){
        throw error
    }
//     uidList.map(async(uid)=>{
//         const isHas=await UserLab.findOne({
//             where:{
//                 uid,
//                 lid
//             }
//         })
//        if(isHas){
//           await UserLab.destroy({
//               where:{
//                 uid,
//                 lid
//               }
               
//          })
//        }
//    })
   
//      ctx.body={
//          status_code:1,
//        }
//      ctx.status=400
})

 

module.exports=router; 
