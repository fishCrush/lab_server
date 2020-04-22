/*
 * @Author: your name
 * @Date: 2020-04-21 13:23:10
 * @LastEditTime: 2020-04-22 12:09:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/lab.js
 */

const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class Lab extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 Lab.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     admin:{  // 超管
        type:Sequelize.STRING,
        allowNull: false,
     },
     name:{  // 实验室名称  这个之后会作为每个实验室的lid
        type:Sequelize.STRING,
         unique:true,
         allowNull: false,
     },
     position:{  // 实验室房号
        type:Sequelize.STRING,
        allowNull: false,
     },
     remark:{  // 实验室备注
        type:Sequelize.STRING,
        allowNull: true,
     },
 
 },{
     sequelize,
     tableName:"lab"  //命名数据表 
 })
 
 module.exports={
    Lab
 }