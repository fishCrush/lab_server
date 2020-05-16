/*
 * @Author: your name
 * @Date: 2020-04-21 15:49:51
 * @LastEditTime: 2020-05-16 11:23:44
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

router.post('/setCookie_lid',async(ctx)=>{    // 种cookie 实验民
     const {lid}=ctx.request.body;
     const lidBase64= new Buffer(lid).toString('base64');//中文转base64编码
     try{
        // ctx.cookies.set('lid', lid, {  expires: new Date('2020-06-15')});   //maxAge：cookie有效时长,单位:毫秒数 这里是20个小时
        ctx.cookies.set('lid', lidBase64);   //默认关闭浏览器时无效
        ctx.body={
            status_code:1
        }
      }catch(error){
         throw error
     }
})


router.post('/create',async(ctx)=>{    // 创建一个新的实验室
       const uid=ctx.cookies.get('uid')
        const {name, position, remark}=ctx.request.body;
        try{
            sequelize.transaction(async t => {
                await Lab.create(
                    {name, position, remark,admin:uid},
                    {
                    transaction: t
                     }
                )
                await UserLab.create(
                    {uid,lid:name},
                    {
                    transaction: t
                     }
                )
            })
    
            ctx.body={
                status_code:1
            }
            ctx.status=200
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
        ctx.status=200
    }catch(error){
        throw error
    }
})

router.post('/list_admin',async(ctx)=>{    // 用户作为超管的所有实验室  //且还包含这些实验室的所有普通管理员
            const uid=ctx.cookies.get('uid')
            // console.log("uid",uid)
            try{
                const labRecords = await Lab.findAll({
                    where:{
                        admin:uid
                    }
                })
                const lidList=labRecords.map(item=>item.name)
              
                const hostUidRecords = await UserLab.findAll({
                    where:{
                        lid:{
                            [Sequelize.Op.in]: lidList
                        }
                    }
                })
                // console.log('hostUidRecords',hostUidRecords)
                const hostList=await Promise.all(
                    hostUidRecords.map(async(hostUidRecord)=>{
                    const obj={lid:hostUidRecord.lid}
                    const user=await User.findOne({
                        where:{
                            uid:hostUidRecord.uid
                        }
                    })
                    obj["name"]=user.name
                    return obj
                   })
                )
                // console.log("hostList",hostList);
                ctx.body={
                    status_code:1,
                    data:{
                        labs:labRecords,
                        hostList
                    }
                }
                ctx.status=200
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
      ctx.status=200
    } catch(error){
        throw error
    }
})

router.post('/admin_and_host',async(ctx)=>{    // 通过lid查询某个实验室的超管名和普通管理员名
    const {lid}=ctx.request.body; 
    try{
        const labRecord = await Lab.findOne({
            where:{
                name:lid
            }
        })
        const adminUid=labRecord.admin
        const userRecord=await User.findOne({
            where:{uid:adminUid}
        })
        const admin = userRecord.name

        const hostRecords=await UserLab.findAll({
            where:{lid}
        })
        // console.log("hostRecords",hostRecords);
        const hostsUid=hostRecords.map(hostRecord=>hostRecord.uid)
        // console.log("hostsUid",hostsUid);
        const hostUserRecords=await User.findAll({
            where:{
                uid:{
                    [Sequelize.Op.in]: hostsUid
                }
            }
        })
        const host=hostUserRecords.map(userRecord=>userRecord.name)

      ctx.body={
          status_code:1,
          data:{
              admin,
              host
          }
      }
      ctx.status=200
    } catch(error){
        throw error
    }
})

router.post('/modify_admin',async(ctx)=>{    // 修改超管
    const {lid,targetName,originUname,password}=ctx.request.body; // uid是目标用户 ouid是当前操作执行者
      try{
        const userRecord=await User.findOne({
            where:{
                name:originUname
            }
         })
        const correct = bcrypt.compareSync(password,userRecord.password) // 查询用户密码是否与数据库里的一致
        if(!correct){ // 检测用户和密码是否正确
            throw new PwdError('密码出错！请重新输入正确密码')
         } 

         const targetUserRecord= await User.findOne({
            where:{  name:targetName   }
        })
        const targetUid=targetUserRecord.uid
         
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
                        originUid:originUname,
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
            ctx.status=200
    }catch(error){
        throw error
    }
    
})

 router.post('/list_host',async(ctx)=>{    // 用户作为普通管理员的所有实验室
            const uid=ctx.cookies.get('uid')
            try{
               const labRecords = await UserLab.findAll({
                    where:{
                        uid
                    }
                })
                // console.log('hhhh labRecords',JSON.stringify(labRecords))
                const lidList=labRecords.map(item=>item.lid)
                // console.log('hhhh lidList',lidList)
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
              ctx.status=200
            } catch(error){
                throw error
            }
 })

router.post('/add_host',async(ctx)=>{    // 增加管理员；没有数据返回，只返回状态码
    const {unames,lid,originUname}=ctx.request.body; 
    try{
    const userRecords= await User.findAll({
        where:{
            name:{
                [Sequelize.Op.in]: unames
            }
        }
    })
    const uids=userRecords.map(item=>item.uid)
    
        uids.map(async(targetUid)=>{
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
                        originUid:originUname, //注意这个originUid字段应该存的用户名，因为一开始设计的就是存的用户名
                        //下面targetUid可以直接用uid，注意获取notification时筛选的用户标志也是随机字符串uid即可
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
         ctx.status=200
    } catch(error){
        throw error
    }
})

router.post('/delete_host',async(ctx)=>{    // 删除管理员；没有数据返回，只返回状态码
    const {unames,lid,originUname}=ctx.request.body; 
    try{
    const userRecords= await User.findAll({
        where:{
            name:{
                [Sequelize.Op.in]: unames
            }
        }
    })
    const uids=userRecords.map(item=>item.uid)
        uids.map(async(targetUid)=>{
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
                    originUid:originUname,
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
         ctx.status=200
    } catch(error){
        throw error
    }

})

 

module.exports=router; 
