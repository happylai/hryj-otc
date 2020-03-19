import request from '@/utils/request'
import qs from 'qs'
const scope = `/admin/third_party_channel`

// 获取托底通道列表
export function channels(meta, data) {
  return request({
    url: `${scope}/channels`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 托底通道总开关控制
export function main_switch(data) {
  return request({
    url: `${scope}/main_switch`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// // 托底通道开关控制
export function switchChannle(data) {
  return request({
    url: `${scope}/switch`,
    method: 'post',
    data: data

  })
}

// 订单统计数据
export function order_statics(meta, data) {
  return request({
    url: `${scope}/order_statics`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 查询托底商家订单
export function orders(meta, data) {
  return request({
    url: `${scope}/orders`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 托底通道支付方式控制
export function pay_type(data) {
  return request({
    url: `${scope}/pay_type`,
    method: 'post',
    data: data
  })
}

// 保存托底通道
export function save(data) {
  return request({
    url: `${scope}/save`,
    method: 'post',
    data: data
  })
}

// 保存托底通道排序
export function sort_save(data) {
  return request({
    url: `${scope}/sort_save`,
    method: 'post',
    data: data
  })
}

// 获取指定支付方式下的通道列表，以顺序排列
export function pay_type_sort(meta, data) {
  return request({
    url: `${scope}/sort/pay_type/${data.payType}`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 获取创建托底通道时的用户模糊查询结果
export function username_query(meta, data) {
  return request({
    url: `${scope}/username/query`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}
