/*
 * @Author: your name
 * @Date: 2020-04-21 14:38:28
 * @LastEditTime: 2020-04-21 20:00:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/thing-label.js
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

class ThingLabel extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 ThingLabel.init({
     id:{
         type:Sequelize.INTEGER,
         autoIncrement:true,
         primaryKey:true,
         allowNull: false,
     },
     lid:{  // 所属实验室名称
        type:Sequelize.STRING,
         allowNull: false,
     },
     thingid:{  // 所属物品
        type:Sequelize.STRING,
        allowNull: false,
     },
     text:{  // 标签文本
        type:Sequelize.STRING,
        //  unique:true,
         allowNull: false,
     },
 
 },{
     sequelize,
     tableName:"thing_label"  //命名数据表 
 })
 
 module.exports={
    ThingLabel
 }