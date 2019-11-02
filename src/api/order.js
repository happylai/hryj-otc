import request from '@/utils/request'

export function getList(params) {
  console.log('params', params)
  return request({
    url: '/admin/order/orders',
    method: 'get'
    // params
  })
}

// 交易明细列表
export function order_details(meta, data) {
  return request({
    url: `/admin/order/order_details`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取订单列表(站内订单/商户订单)
export function order_list(meta, data) {
  return request({
    url: `/admin/order/orders`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 交易明细列表
export function order_detail(data) {
  return request({
    url: `/admin/order/order`,
    method: 'get',
    params: data
  })
}
