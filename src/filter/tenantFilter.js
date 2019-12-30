var str = ''
var email = ''
export const userName = (rule, value, callback)=>{
    if(value == ''){
        callback( new Error('账户不能为空'))
    }
    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        callback ('用户名不能有特殊字符');
    }
    if(/(^\_)|(\__)|(\_+$)/.test(value)){
        callback(new Error('用户名首尾不能出现下划线'));
    }
    if(/^\d+\d+\d$/.test(value)){
        callback(new Error('用户名不能全为数字'));
    }
    if(!/^[\S]{5,12}$/.test(value)){
        callback(new Error('用户名必须6到12位，且不能出现空格'));
    }
    callback()
}

const pass = (rule, value, callback)=>{
    str = value
    if(!/^[\S]{6,12}$/.test(value)){
        callback(new Error('密码必须6到12位，且不能出现空格'))
        return
    }
    callback()
}
const passWordConfirm = (rule, value, callback)=>{
    if( str !== value){
        callback(new Error('两次不一样,请重新输入'))
        return
    }
    callback()
}

const telephoneFilter = (rule, value, callback)=>{
    var reg = /^1[3|4|5|8][0-9]\d{4,8}$/
    if(!reg.test(value)){
        callback(new Error('请输入11位电话号码'))
        return
    }
    callback()
}

const virtualNumFilter = (rule, value, callback)=>{
    if(value == ''){
        callback(new Error('请输入虚机数'))
        return ;
    }
    if(value == 0){
        callback(new Error('请输入大于0的整数'))
        return
    }
    callback()
}

export const ruleValidate = {
    operatorAccount: [{validator: userName, required: true, trigger:'blur'}],
    name: [{required: true, message:'姓名不能为空', trigger: 'blur'}],
    password: [{validator: pass, required: true, trigger: 'blur'}],
    confirmPassword: [{validator: passWordConfirm, required: true, trigger: 'blur'}],
    email: [{ type: 'email',required: true, message: '请输入合法邮箱', trigger: 'blur' }],
    telephoneNo: [{validator: telephoneFilter, required: true, tirgger: 'blur'}],
    company: [{required: true, message:'组织部门不能为空',tirgger:'blur'}],
    virtualNum: [{validator: virtualNumFilter, required: true, tirgger: 'blur'}]
}