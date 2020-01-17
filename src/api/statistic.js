import request from '@/utils/request'
import qs from 'qs'

//
// 数据中心统计数据

export function data_center(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/statistics/data_center`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 匹配订单统计数据
export function merchant_order_statics(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/statistics/merchant_order_statics`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 整体统计数据
export function merchant_statics_total(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/statistics/merchant_statics_total`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 查询每日统计数据
export function merchant_statics_day(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/statistics/merchant_statics_day`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}
