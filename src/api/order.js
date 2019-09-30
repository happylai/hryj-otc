import request from '@/utils/request'

export function getList(params) {
    console.log("params",params)
  return request({
    url: '/admin/order/orders',
    method: 'get',
    // params
  })
}
