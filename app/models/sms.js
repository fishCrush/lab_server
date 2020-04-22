/*
 * @Author: your name
 * @Date: 2020-04-20 20:54:22
 * @LastEditTime: 2020-04-21 13:23:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/sms.js
 */

const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class Sms extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 Sms.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     phone:{  // 手机号码
        type:Sequelize.STRING,
         unique:true,
         allowNull: false,

     },
     code:{  // 验证码
        type:Sequelize.STRING,
          allowNull: false,
     },
 
 },{
     sequelize,
     tableName:"sms"  //命名数据表 
 })
 
 module.exports={
    Sms
 }