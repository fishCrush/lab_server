/*
 * @Author: your name
 * @Date: 2020-04-21 14:28:28
 * @LastEditTime: 2020-04-22 22:52:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/thing.js
 */

const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class Thing extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 Thing.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },

   //   uid:{  // 不区分用户  本来所有用户对于同一个实验室看到的东西都是一样的
   //    type:Sequelize.STRING,
   //    allowNull: false,
   //   },

     lid:{  // 所属实验室 低于资源，是以一个实验室为单位展示的，所以决定要返回多少条记录是由lid决定的
        type:Sequelize.STRING,
        allowNull: false,
     },

     thingid:{  // 所属实验室 低于资源，是以一个实验室为单位展示的，所以决定要返回多少条记录是由lid决定的
      type:Sequelize.STRING,
      allowNull: false,
      unique:true
    },

     name:{  // 物品名称  
        type:Sequelize.STRING,
         allowNull: false,
     },
     num:{  // 物品数量
        type:Sequelize.INTEGER,
        allowNull: false,
     },
     rate:{  // 物品重要性
        type:Sequelize.INTEGER,
        allowNull: true,
     },
     remark:{  // 物品备注
        type:Sequelize.STRING,
        allowNull: true,
     },
     labels:{  // 物品标签（字符串，前端处理数组成字符串）
      type:Sequelize.STRING,
      allowNull: true,
   },
 
 },{
     sequelize,
     tableName:"thing"  //命名数据表 
 })
 
 module.exports={
    Thing
 }