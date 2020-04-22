/*
 * @Author: your name
 * @Date: 2020-04-18 16:12:10
 * @LastEditTime: 2020-04-21 10:12:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /server/app/validator/validator.js
 */
const {LinValidator,Rule} = require('../../core/lin-validator-v2');  // 多个Rule的话是且的关系
const {User} = require('../models/user')
const {LoginType} =require ('../lib/enum')

class PositiveIntegerValidator extends LinValidator{
    constructor(){
        super()
        this.id=[
            new Rule('isInt','需要是正整数',{min:1})
        ]
    }
}

class RegisterValidator extends LinValidator{ //注册验证器
    constructor(){
        super()
        this.name=[
            new Rule('isLength','用户名至少2个字符，最多32个字符',{
                min:2,
                max:32
            }),
        ]
        this.password1=[
            //为了安全给用户指定范围   不希望只是123456  包含特殊字符
            new Rule('isLength','密码至少6个字符，最多32个字符',{
                min:6,
                max:32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]') // 正则表达式
        ]
        this.password2=this.password1;
    }

    validatePassword(vals) {        //  跨多字段的校验，可使用LIN的自定义校验
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }

    async validateName(vals){
        const name = vals.body.name
        const user= await User.findOne({
            where:{
                name:name
            }
        })
        if(user){
            throw Error('用户名已存在')
        }
    }
}

class TokenValidator extends LinValidator{  //token验证器
    constructor(){
        super()
        this.account=[  // 用户账户
            new Rule('isLength','用户名不符合规范，至少2个字符，最多32个字符',{
                min:2,
                max:32
            }),
        ]
        this.secret=[  // 用户密码
            new Rule('isOptional'),
            new Rule('isLength','用户名不符合规范，至少2个字符，最多32个字符',{
                min:2,
                max:32
            }),
        ]
    }

    validateLoginType(val){
        if(!val.body.type){
            throw new Error('登录的type是必需参数')
        }

        if(!LoginType.isThisType(val.body.type)){
            throw new Error('type参数不合法')
        }
    }
}


module.exports={
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator
}