import request from '@/utils/request'
import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'

export function login(data) {
  return new Promise((resolve, reject) => {
    var params = new FormData()
    params.append('username', data.username)
    params.append('password', data.password)

    axios.post(`${process.env.VUE_APP_BASE_API}/admin/sign_in`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (res.data.code === 0) {
          resolve(res)
          console.log('apijs')

          // Message({
          //   message: "登录成功",
          //   type: 'success',
          //   duration: 5 * 1000
          // })
        } else {
          Message({
            message: res.data.message || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
          reject(res)
        }
      })

    // return request({
    //   url: '/admin/sign_in',
    //   method: 'post',
    //   data
    // })
  })
}

export function register(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function captcha(token) {
  return request({
    url: '/admin/captcha',
    method: 'POST'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
