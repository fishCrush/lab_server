// 模拟枚举
function isThisType(val){
    for(let key in this){
        if(this[key] === val){
            return true
        }
    }
    return false
}

const LoginType = {
    USER_NAME:101,   //账号密码登录
    USER_MOBILE:102,   // 手机登录
    ADMIN_EMAIL:200,
    USER_MINI_PROGRAM:100,
    isThisType
}


module.exports = {
    LoginType
}