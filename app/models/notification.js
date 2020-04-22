/*
 * @Author: your name
 * @Date: 2020-04-22 09:22:01
 * @LastEditTime: 2020-04-22 12:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/notification.js
 */

const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class Notification extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 Notification.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     nid:{  // 通知自己的id
        type:Sequelize.STRING,
        allowNull: false,
        unique:true
     },
     originUid:{  // 源操作人
      type:Sequelize.STRING,
      allowNull: false,
     },
     
     targetUid:  {  // 给某人的通知
        type:Sequelize.STRING,
        allowNull: false,
     },
     lid:{  // 相关实验室
        type:Sequelize.STRING,
        allowNull: false,
     },
     actionType:{  // 操作类型 add/delete
        type:Sequelize.STRING,
        allowNull: false,
     },
  
     identityType:{  // 
        type:Sequelize.STRING,
        allowNull: false,
     },
     isRead:{
        type:Sequelize.BOOLEAN,  
        allowNull: false,
        defaultValue: false,  //  默认为未读
     }
    
 },{
     sequelize,
     tableName:"notification"  
 })
 
 module.exports={
    Notification
 }