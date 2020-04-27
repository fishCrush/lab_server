/*
 * @Author: your name
 * @Date: 2020-04-23 22:33:22
 * @LastEditTime: 2020-04-23 23:39:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/test.js
 */
const Router=require('koa-router');
// const router =new Router();

const router =new Router({
    prefix:"/test"
});

router.post('/test',ctx=>{
    ctx.body={
        msg:'okll'
    }
}
)

module.exports=router; 
