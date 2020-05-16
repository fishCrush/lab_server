/*
 * @Author: your name
 * @Date: 2020-04-23 15:33:13
 * @LastEditTime: 2020-05-16 11:25:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/temp.js
 */
const  axios=require('axios')
const Router=require('koa-router');

const router =new Router({
    prefix:"/temp"
});


router.post('/list',async(ctx)=>{  
      // 获取某实验室的温度数据
})


module.exports=router; 
