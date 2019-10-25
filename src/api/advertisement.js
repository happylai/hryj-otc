import request from '@/utils/request'
import qs from 'qs'

// 获取广告列表
export function advertises(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/advertise/advertises`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取广告详情
export function advertise(data) {
  return request({
    url: `/admin/advertise/advertise`,
    method: 'get',
    params: data

  })
}

// 下架广告
export function down_advertise(data) {
  return request({
    url: `/admin/advertise/down_advertise`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
