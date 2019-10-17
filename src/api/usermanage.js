import request from '@/utils/request'

export function payType() {
  return request({
    url: '/admin/user/pay_type',
    method: 'get'
  })
}

export function payTypeDetail(id) {
  return request({
    url: `/admin/user/pay_type/${id}`,
    method: 'get'
  })
}

export function payTypeAudit(data) {
  return request({
    url: `/admin/user/pay_type/audit`,
    method: 'post',
    data: data
  })
}
