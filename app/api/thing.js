/*
 * @Author: your name
 * @Date: 2020-04-22 15:24:04
 * @LastEditTime: 2020-04-22 23:45:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/thing.js
 */
const Router=require('koa-router');
const Uuid=require('uuid')
const {Sequelize}=require('sequelize')
const {  sequelize } = require('../../core/db')  //用来生成随机的唯一标志字符串 
const { Thing } = require('@models/thing')
const { ThingImg } = require('@models/thing_img')
// const { ThingLabel } = require('@models/thing_label')
const { History } = require('@models/history')
const { HistoryModifyChange } = require('@models/history_modify_change')



const router =new Router({
    prefix:"/thing"
});


//资源列表
router.post('/query_by_lid',async(ctx)=>{ 
    const {lid }=ctx.request.body  // label为字符串类型，前端进行处理展示为数组
    const res=await Thing.findAll({
        where:{
            lid
        }
    })
})

// 添加物品
router.post('/add',async(ctx)=>{    
    const {uid,lid,name,num,rate,remark,labels, imgs }=ctx.request.body  // label为字符串类型，前端进行处理展示为数组
    const thingid=Uuid.v1()
    const hid=Uuid.v1()
    try{
         await Thing.create({
            lid,thingid,name,num,rate,remark,labels
         }
         )
         await History.create({
             lid,
             hid,
             type:'add', // type 枚举 add,delete,modify
             operator:uid,
             thing:name     //时间到时候会表自带的createdAt中取
         })
        
         if(imgs){
             try{
                imgs.map(async(url)=>{
                    await  ThingImg.create({ lid, thingid, url }
                    )
                  })
             }catch(error){
                 throw error
             }
         }
        ctx.body={
            status_code:1,
        }
        ctx.status=400
    } catch(error){
      // throw new Error('添加新物品失败')
      throw error
    }
   
})

// 修改物品  //注意这里的逻辑是每次只单独修改一个物品
router.post('/modify',async(ctx)=>{  

    try{
        const hid=Uuid.v1()
        // 新值  
        const {uid,lid,thingid,name,
            nNum, nRate, nRemark, nLabels}=ctx.request.body

        // 旧值
        const originRecord=await Thing.findOne({
            where:{lid,thingid}
        })
        const{num,rate,remark,labels}=originRecord

        // 资源表相关
        await Thing.update({   //注意取完旧值后再改变thing表
            num:nNum,
            rate:nRate,
            remark:nRemark,
            labels:nLabels
          },{
              where:{  thingid  }
          }
        )

        // 操作历史记录相关
        await History.create({  
            lid,
            hid,
            operator:uid,
            type:'modify', // type 枚举 add,delete,modify
            thing:name     //时间到时候会取表自带的createdAt字段的值
        })

        // 变化属性表相关
        const oldArr=[num,rate,remark,labels]; 
        const newArr=[nNum, nRate, nRemark, nLabels]
        const attri=["num", "rate", "remark", "label"]
        const changeArr=[]
        attri.map((item,index)=>{
            if(oldArr[index]!==newArr[index]){   // 新旧值对比数组,不相同的则需要记录到变化属性表中
               const mapObj={}
                mapObj["lid"]=lid
                mapObj["hid"]=hid
                mapObj["attri"]=item
                mapObj["old"]=String(oldArr[index])
                mapObj["new"]=String(newArr[index])
               changeArr.push(mapObj)
            }
        })
        console.log("changeArr",changeArr)
        await  HistoryModifyChange.bulkCreate(changeArr)
        
        ctx.body={
            status_code:1,
        }
        ctx.status=400
    } catch(error){
      throw error
    }
   
})



// 删除物品
router.post('/delete',async(ctx)=>{  
    const {thingid}=ctx.request.body;
    try{
       await  Thing.destroy({
           where:{
               thingid
           }
       })

       ctx.body={
        status_code:1,
     }
     ctx.status=400

    } catch(error){
        throw error
    }

})  


module.exports=router; 
