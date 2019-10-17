/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */

export function validateUsername  (rule, value, callback)  {
  if (!value.length) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
export function validateEamil  (rule, value, callback)  {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

  if (!value.length) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    if (reg.test(value)) {
      callback()
    }
    else {
      callback(new Error('请输入正确的邮箱'))
    }
    callback()
  }
}

export function validatePassword  (rule, value, callback) {
  if(!value){
    callback(new Error('请输入密码'))
  }
  else if (value.length < 6) {
    callback(new Error('密码必须大于6位数'))
  } else {
    callback()
  }
}
export const validateRepatePassword =  (rule, value, callback)=>{
    if(!value){
      callback(new Error('请重复密码'))
    }
    else if (value.length < 6) {
      callback(new Error('密码必须大于6位数'))
    }
   else if(this.regForm.password!==value){
    callback(new Error('密码不一致'))
    }
}