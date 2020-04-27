/*
 * @Author: your name
 * @Date: 2020-04-18 18:58:25
 * @LastEditTime: 2020-04-24 11:55:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/config/config.js
 */
module.exports={
    // 生产环境 prod
    environment:"dev", // 开发环境dev
     database:{  //mysql的ORM sequelize的基本配置
         dbName:"labs",
         host:'localhost',
         port:3306,
         user:"root",
         password:"@qianduan670514"
     },
     security:{   // jwt令牌相关
        secretKey:"abcdefg",
        expiresIn:60*60*24*30  //令牌的过期时间  60*60：1个小时
    },
    sms:{  // 阿里云sms短信服务相关
        accessKeyId:'LTAI4GJMkz2zRLBQQJwBpmP1',
        accessKeySecret:'F47S5u59WUQtjK6W8jXtWpr20URyP8',
        endpoint:'https://dysmsapi.aliyuncs.com',  //非自定义，短信服务的服务接入地址
        apiVersion:'2017-05-25',  // 非自定义!，跟着api文档写
       
        RegionId:"cn-hangzhou",
        SignName: "实验室资源管理系统",
        TemplateCode: "SMS_188570602"
    },
    oss:{  //阿里云对象存储 oss
        region: 'oss-cn-shenzhen',  // bucket所在的区域  ！选的深圳
        endpoint:'oss-cn-shenzhen.aliyuncs.com',
        accessKeyId: 'LTAI4GCo3jGvNHANFMDvGg6z',
        accessKeySecret: 'qKmBGujFdNnhURrEXOV500xI7hl4JN',
        bucket:'fishlab',
        // timeout：默认为 60 秒，指定访问 OSS 的 API 的超时时间。
    }
}