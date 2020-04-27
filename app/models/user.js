/*
 * @Author: your name
 * @Date: 2020-04-18 22:18:42
 * @LastEditTime: 2020-04-25 12:47:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/user.js
 */
const bcrypt=require('bcryptjs')
const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class User extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数
}

User.init({
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull: false,
    },
    uid:{  // 
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,
    },
    name:{  // 这个之后会作为每个用户的uid?待定
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
        set(val){        // 加密密码后再存入数据表
            const salt=bcrypt.genSaltSync(10) //生成盐
            const pwd = bcrypt.hashSync(val,salt) // 加密
            this.setDataValue('password',pwd)  
        }
    },
    phone:{  // 手机号码
        type:Sequelize.STRING,
        //  unique:true,
         allowNull: false,
     },
     code:{  // 验证码
        type:Sequelize.STRING,
        allowNull: false,
     },
    

},{
    sequelize,
    tableName:"user"  //命名数据表 
})

module.exports={
    User
}