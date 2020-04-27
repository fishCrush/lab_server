/*
 * @Author: your name
 * @Date: 2020-04-24 02:33:18
 * @LastEditTime: 2020-04-24 09:54:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/history_bulk_names.js
 */
const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

// 批量增加的名字
class HistoryBulkName extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

}


// 保存批量增加中除了第一个的物品名字
HistoryBulkName.init({
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
    hid:{  // 所属操作批量增加历史的hid   必须与history表里的hid一样
        type:Sequelize.STRING,
        allowNull: false,
    },
    thing:{  // 被操作物品  批量增加物品的名称(除去第一个)
        type:Sequelize.STRING,
        allowNull: false,
     }

},{
    sequelize,
    tableName:"history_bulk_name"  //命名数据表 
})

module.exports={
    HistoryBulkName
}