/*
 * @Author: your name
 * @Date: 2020-04-24 10:24:45
 * @LastEditTime: 2020-05-16 11:24:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/api/oss.js
 */

Router=require('koa-router');
const Uuid=require('uuid')
const { History }=require('@models/history')
const { oss } =require("../../config/config")
const OSS = require('ali-oss');
const { EmptyUploadError ,OssUploadError} = require('../../core/http-error')
const { getBufferFromFile }=require('../../core/utils')
const router =new Router({
    prefix:"/upload"
});
const {region,accessKeyId,accessKeySecret,bucket,endpoint}=oss

router.post('/img_oss',async(ctx)=>{    // 获取某实验室的操作历史记录
    const files = ctx.request.files;
    console.log("hahahhaha files",files)
    if (!files.file) {
      throw new EmptyUploadError()
    }
    const file=files.file  //传递多个时files.file为数组  
    //注意：由于前端发送图片是每一张就一个请求的(可能是antd组件所为)，所以此处这个file不是数组
    try{
        let client = new OSS({ region,   accessKeyId, accessKeySecret, bucket,endpoint});
        client.useBucket(bucket);
        let buffer = getBufferFromFile(file)  // 图片先处理成buffer类型的可读流数据类型
        const subSuffix=Uuid.v1()
        let result = await client.put(`${subSuffix}`, buffer); // oss的put接口 上传文件
        // console.log("result",result);
        const { url,res }= result
        if(res.statusCode!==200){
        throw new OssUploadError()
        }
        ctx.body={
            status_code:1,
            data:{
                url
            }
        }
        ctx.status=200

    } catch(error){
        throw error
    }
   
})

module.exports=router; 

