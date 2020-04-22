/*
 * @Author: your name
 * @Date: 2020-04-21 14:38:28
 * @LastEditTime: 2020-04-21 20:00:00
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

class ThingImg extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

 }
 
 ThingImg.init({
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
     url:{  // 标签文本
        // todo 看type类型需不需要改成blob 或者 string的话需不需增大长度
        type:Sequelize.STRING,
        //  unique:true,
         allowNull: false,
     },
 
 },{
     sequelize,
     tableName:"thing_img"  //命名数据表 
 })
 
 module.exports={
    ThingImg
 }