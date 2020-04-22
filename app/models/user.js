/*
 * @Author: your name
 * @Date: 2020-04-18 22:18:42
 * @LastEditTime: 2020-04-22 15:19:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /server/app/models/user.js
 */
const bcrypt=require('bcryptjs')
const {sequelize} =require('../../core/db')  // 导入sequelize实例
const {Sequelize,Model}=require('sequelize')  // 导入Sequelize

class User extends Model{  // 模型表里可定义静态的方法；注意不能定义构造函数

   static async  verifyNamePassword(name,plainPassword){ // 查询用户是否存在 // NO USE
       const user = await User.findOne({
           where:{
            name
           }
       })
       if(!user){
           throw new global.errs.NotFound('用户不存在')
       }
       const correct = bcrypt.compareSync(plainPassword,user.password) // 查询用户密码是否与数据库里的一致
       if(!correct){
           throw new global.errs.AuthFailed('密码不正确')
       }

       return user;
   }

}

User.init({
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull: false,
    },
    name:{  // 这个之后会作为每个用户的uid
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