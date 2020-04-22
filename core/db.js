/*
 * @Author: your name
 * @Date: 2020-04-18 21:58:53
 * @LastEditTime: 2020-04-21 20:37:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/core/db.js
 */
// sequelize的数据库相关配置
const Sequelize =require('sequelize');
const {dbName,host,port,user,password}=require('../config/config').database
const {unset, clone, isArray} = require('lodash')


const sequelize= new Sequelize(dbName,user,password,{
    dialect:"mysql",
    host,
    port,
    timezone:'+08:00',
    define:{
        timestamps:true, // 自动添加createdAt和updatedAt
        paranoid:true,// 软删除
        createdAt:'created_at',
        updatedAt:'updated_at',
        deletedAt:'deleted_at',
        underscored:true
    }
})

sequelize.sync({  // 根据 model自动创建表
    // force:true  // 删除原有表格开发阶段可临时设置为true
    force:false  //
}); // 必备此句


// 改变全局Model来进行序列化
// Model.prototype.toJSON= function(){
//     // let data = this.dataValues
//     let data = clone(this.dataValues)
//     unset(data, 'updated_at')
//     unset(data, 'created_at')
//     unset(data, 'deleted_at')

//     for (key in data){
//         if(key === 'image'){
//             if(!data[key].startsWith('http'))
//                 data[key]=global.config.host + data[key]
//         }
//     }

//     if(isArray(this.exclude)){
//         this.exclude.forEach(
//             (value)=>{
//                 unset(data,value)
//             }
//         )
//     }
//     // this.exclude
//     // exclude
//     // a,b,c,d,e
//     return data
// }

module.exports={
    sequelize 
}