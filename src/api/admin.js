import request from '@/utils/request'
import qs from 'qs'
export function admins(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/admins`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

export function freeze(data) {
  return request({
    url: `/admin/freeze`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function save(data) {
  return request({
    url: `/admin/save`,
    method: 'post',
    data: data
  })
}

// 获取后台渲染所需数据
export function get_system_const(data, meta) {
  return request({
    url: `/admin/system/renders`,
    method: 'get',
    params: data
  })
}
