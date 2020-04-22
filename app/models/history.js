/*
 * @Author: your name
 * @Date: 2020-04-21 15:20:27
 * @LastEditTime: 2020-04-22 19:09:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/history.js
 */
const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class History extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 History.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     lid:{  // 所属实验室的lid
      type:Sequelize.STRING,
      allowNull: false,
     },
     hid:{  // 操作历史记录的id
       type:Sequelize.STRING,
        allowNull: false,
        unique:true
     },
     type:{  // 操作历史记录的类型 add delete modify
        type:Sequelize.STRING,
        allowNull: false,
     },
     operator:{  // 操作人
        type:Sequelize.STRING,
        allowNull: false,
     },
     thing:{  // 被操作物品
        type:Sequelize.STRING,
        allowNull: false,
     }
 },{
     sequelize,
     tableName:"history"  //命名数据表 
 })
 
 module.exports={
    History
 }