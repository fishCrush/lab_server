/*
 * @Author: your name
 * @Date: 2020-04-23 13:13:59
 * @LastEditTime: 2020-04-27 22:22:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/history.js
 */
const Router=require('koa-router');
const {History}=require('@models/history')
const {HistoryModifyChange}=require('@models/history_modify_change')
const {HistoryBulkName}= require('@models/history_bulk_name')

const router =new Router({
    prefix:"/history"
});




router.post('/list',async(ctx)=>{    // 获取某实验室的操作历史记录
    const {lid}=ctx.request.body;
    try{
        const historyRecords=await History.findAll({
            where:{
                lid
            },
            'order': [["created_at","DESC"]]  //按照创建时间降序
        })
        console.log("hahahha historyRecords",historyRecords)
       const changeRecords =await HistoryModifyChange.findAll({
            where:{
                lid
            }
        })

        const bulkRecords =await HistoryBulkName.findAll({
            where:{
                lid
            }
        })
        ctx.body={
            status_code:1,
            data:{
                historys:historyRecords,
                changes:changeRecords,
                bulks:bulkRecords
            }
        }
        ctx.status=200

    } catch(error){
        throw error
    }
   
})

module.exports=router; 

