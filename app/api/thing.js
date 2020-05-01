/*
 * @Author: your name
 * @Date: 2020-04-22 15:24:04
 * @LastEditTime: 2020-05-01 14:17:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/thing.js
 */
const Router=require('koa-router');
const Uuid=require('uuid')
const xlsx = require('xlsx');
const { clone }=require('lodash')
const { Lab } = require('@models/lab')
const { User } = require('@models/user')
const { Thing } = require('@models/thing')
const { ThingImg } = require('@models/thing_img')
const { History } = require('@models/history')
const { HistoryModifyChange } = require('@models/history_modify_change')
const { HistoryBulkName } = require('@models/history_bulk_name')
const { EmptyUploadError, InvalidUploadError, RequireError } = require('../../core/http-error')
const { getBufferFromFile } = require('../../core/utils')
const router =new Router({
    prefix:"/thing"
});


// 下载文件  返回JSON数据
router.post('/export_info',async(ctx)=>{  
    const { lid }=ctx.request.body
    // const lid="光电光纤研究实验室";
    const oldKeys=['name', 'num','labels','remark']
    try{
        const thingRecords= await Thing.findAll({
         where:{ lid } ,
         attributes: oldKeys
        })
        // console.log("thingRecords",thingRecords)
        const  formatRecords=[]
        const  newKeys=["物品名称","物品数量","物品标签","物品备注"]
        thingRecords.map(oldObj=>{
            let newObj={}
            newKeys.map((key,index)=>{
                const oldKey=oldKeys[index]
                newObj[key]=oldObj[oldKey]
            })
            formatRecords.push(newObj)
        })
        // console.log(formatRecords)
        ctx.body={
            status_code:1,
            data:formatRecords
        }
       
    } catch(error){
        throw error
    }   
}) 


// 下载列表 导出全部物品  直接返回excel文件
router.post('/export_all',async(ctx)=>{  
    // const { lid }=ctx.request.body
    const lid="光电光纤研究实验室";
    const oldKeys=['name', 'num','labels','remark']
    try{
        const thingRecords= await Thing.findAll({
         where:{ lid } ,
         attributes: oldKeys
        })
        // console.log("thingRecords",thingRecords)
        const  formatRecords=[]
        const  newKeys=["物品名称","物品数量","物品标签","物品备注"]
        thingRecords.map(oldObj=>{
            let newObj={}
            newKeys.map((key,index)=>{
                const oldKey=oldKeys[index]
                newObj[key]=oldObj[oldKey]
            })
            formatRecords.push(newObj)
        })
        // console.log(formatRecords)

        const sheet = xlsx.utils.json_to_sheet(formatRecords );
        const book = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(book, sheet);
        ctx.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        ctx.attachment('lab_things.xlsx');
        ctx.body = xlsx.write(book, { type: 'buffer' });
    } catch(error){
        throw error
    }   
}) 


//初始化时的资源列表  当前用户的第一间实验室下的资源
router.post('/query_init',async(ctx)=>{ 
    const uid=ctx.cookies.get('uid')
    // const { lid }=ctx.request.body  // label为字符串类型，前端进行处理展示为数组
    try{
        const labRecords = await Lab.findAll({
            where:{  admin:uid  }
        })
        const lid=labRecords[0].name  //默认取第一个实验室
        const thingRecords=await Thing.findAll({
            where:{  lid  }
        })
        const  imgRecords=await ThingImg.findAll({
            where:{  lid }
        })
        ctx.body={
            status_code:1,
            data:{
                things:thingRecords,
                imgs:imgRecords
            }
        }
        ctx.status=200
    } catch(error){
         throw error
    } 
})


//资源列表  根据lid
router.post('/query_by_lid',async(ctx)=>{ 
    const { lid }=ctx.request.body  // label为字符串类型，前端进行处理展示为数组
    try{
        const thingRecords=await Thing.findAll({
            where:{  lid  }
        })
        const  imgRecords=await ThingImg.findAll({
            where:{  lid }
        })
        // console.log("thingRecords,imgRecords",thingRecords,imgRecords)
        ctx.body={
            status_code:1,
            data:{
                things:thingRecords,
                imgs:imgRecords
            }
        }
        ctx.status=200
    } catch(error){
         throw error
    } 
})

// 添加物品
router.post('/add',async(ctx)=>{  
    const {uname,lid,name,num,rate,remark,labels, imgs }=ctx.request.body  // label为字符串类型，前端进行处理展示为数组
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
             operator:uname,
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
        ctx.status=200
    } catch(error){
      throw error
    }
   
})

//批量添加物品  上传文件
router.post('/add_bulk_upload',async(ctx)=>{  
    const uid=ctx.cookies.get('uid')
    const lidBase64= ctx.cookies.get('lid')
    try{ 
    const userRecord=await User.findOne({where:{uid}})
    const uname=userRecord.name
    const lid=new Buffer(lidBase64, 'base64').toString();
    const files = ctx.request.files;
    // const file=files.file
    // console.log("啦啦啦啦啦啦啦啦啦啦files",files)
    // console.log("哈哈哈哈哈哈哈哈哈哈或",file)

    if(!files||!files.file){  //若没有文件
        throw new EmptyUploadError()
    }

    const buffer = getBufferFromFile(files.file);
    let parsedJson=[]

    
    try {  // 利用xlsx库将上传的excel里的数据解析取出
        const parsedData = xlsx.read(buffer, { type: 'buffer' });
        const sheet = Object.keys(parsedData.Sheets)[0];
        parsedJson = xlsx.utils.sheet_to_json(parsedData.Sheets[sheet]);
      } catch (e) {
        throw new InvalidUploadError();  // 若文件里数据不正确
    }
    // console.log("parsedJson",parsedJson);
    
    if (parsedJson.length === 0) {
        throw new DataEmptyUploadError()  // 若上传了文件但文件没有数据
    }

    // 进行key值得转换（中文表头字段换成英文key）
    const formatResult = [];
    const newKeys=["name","num","rate","labels","remark"]
    parsedJson.map((rowObj,indexo)=>{
        const newObj={}
        const keys= Object.keys(rowObj);
         keys.map((key,index)=>{
             const newKey=newKeys[index]
             newObj[newKey]=rowObj[key]
         })
        // 检查必填字段name和num是否有缺
         if(!newObj["name"] || !newObj["num"]){
             throw new RequireError()
         }

         const thingid=Uuid.v1()
         newObj["lid"]=lid
         newObj["thingid"]=thingid
         formatResult.push(newObj);
    })
    // console.log("哈哈formatResult",formatResult)
    const thingNames=formatResult.map(itemObj=>itemObj.name)
      // 将数据加入数据库里
        await Thing.bulkCreate(formatResult)
        // 操作历史记录history表相关
        const hid=Uuid.v1()
        await History.create({  
            lid,
            hid,
            operator:uname,
            type:'bulk', // type 枚举 add,delete,modify, bulk批量增加
            thing:thingNames[0]    //时间到时候会取表自带的createdAt字段的值
        })

        // 和history_bulk表相关的
        const thingNamesClone=clone(thingNames)
        thingNamesClone.shift()  // 去掉第一个然后加入history_bulk表
        // console.log('thingNamesClone',thingNamesClone)

        if(thingNamesClone.length>0){
            thingNamesClone.map(async(thing)=>{
                await HistoryBulkName.create({
                    lid,
                    hid,  // 与上面history表的保持一致，这是联系的关系
                    thing
                })
            })
        }

        ctx.body={
            status_code:1
        }
        ctx.status=200

    } catch(error){
        throw error
    }
   
})

// 修改物品  //注意这里的逻辑是每次只单独修改一个物品
router.post('/modify',async(ctx)=>{  

    try{
        const hid=Uuid.v1()
        // 新值  
        const {uname,lid,thingid,name,imgs,
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
        console.log("服务端接收到的imgs",imgs);
        if(imgs>0){  //图片暂时只做新增，无删除功能
               imgs.map(async(url)=>{
                   await  ThingImg.create({ lid, thingid, url }
                   )
                 })
        }

        // 操作历史记录相关
        await History.create({  
            lid,
            hid,
            operator:uname,
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
        // console.log("changeArr",changeArr)
        await  HistoryModifyChange.bulkCreate(changeArr)
        
        ctx.body={
            status_code:1,
        }
        ctx.status=200
    } catch(error){
      throw error
    }
   
})

// 删除物品
router.post('/delete',async(ctx)=>{  
    const hid=Uuid.v1()
    const {uname,lid,name,thingid}=ctx.request.body; // name:物品名称
    try{
       await  Thing.destroy({
           where:{
               thingid
           }
       })
         // 操作历史记录相关
        await History.create({  
            lid,
            hid,
            operator:uname,
            type:'delete', // type 枚举 add,delete,modify
            thing:name     //时间到时候会取表自带的createdAt字段的值
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
