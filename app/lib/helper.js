function success(msg,errCode){
    throw new global.errs.Success()
}

module.exports={
    success
}