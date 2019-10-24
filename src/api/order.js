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
