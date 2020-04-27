/*
 * @Author: your name
 * @Date: 2020-04-23 15:33:13
 * @LastEditTime: 2020-04-23 18:07:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/temp.js
 */
const  axios=require('axios')
const Router=require('koa-router');

const router =new Router({
    prefix:"/temp"
});

// axios.get('/user', {
//     params: {
//       ID: 12345
//     }
//   })
router.post('/list',async(ctx)=>{  
      // 获取某实验室的温度数据
})


module.exports=router; 
