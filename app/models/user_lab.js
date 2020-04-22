/*
 * @Author: your name
 * @Date: 2020-04-21 15:41:12
 * @LastEditTime: 2020-04-21 18:23:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/user_lab.js
 */


 /*
 * @Author: your name
 * @Date: 2020-04-21 14:28:28
 * @LastEditTime: 2020-04-21 14:34:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/thing.js
 */

const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize


// 为了实现 用户 和 实验室 之间多对多关系的表
class UserLab extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 UserLab.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     
     uid:{  // 用户名称
        type:Sequelize.STRING,
        allowNull: false,
     },
     
     lid:{  // 实验室名称
        type:Sequelize.STRING,
        allowNull: false,
     },
 
 },{
     sequelize,
     tableName:"user_lab"  //命名数据表 
 })
 
 module.exports={
    UserLab
 }
