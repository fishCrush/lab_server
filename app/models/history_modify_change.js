/*
 * @Author: your name
 * @Date: 2020-04-21 15:33:18
 * @LastEditTime: 2020-04-22 22:42:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/history_modify_change.js
 */
const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class HistoryModifyChange extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 HistoryModifyChange.init({
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
     hid:{  // 所属操作历史的hid   必须与history表里的hid一样
        type:Sequelize.STRING,
        allowNull: false,
     },
     attri:{  // 操作历史记录的类型 add delete modify
        type:Sequelize.STRING,
        allowNull: false,
     },
     new:{  // 操作人
        type:Sequelize.STRING,
        allowNull: false,
     },
     old:{  // 被操作物品
        type:Sequelize.STRING,
        allowNull: false,
     },
 
 },{
     sequelize,
     tableName:"history_modify_change"  //命名数据表 
 })
 
 module.exports={
    HistoryModifyChange
 }