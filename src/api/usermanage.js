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

// 用户详情
export function role_detail(id) {
  return request({
    url: `/admin/user/role_apply/${id}`,
    method: 'get'
  })
}

// 用户角色申请列表
export function role_apply_list(meta, data) {
  return request({
    url: '/admin/user/role_apply/applis',
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 用户角色申请审核
export function role_apply_audit(data) {
  return request({
    url: `/admin/user/role_apply/audit`,
    method: 'post',
    data
  })
}

// 角色申请用户详情
export function role_apply_detail(data) {
  return request({
    url: `/admin/user/role_apply/detail`,
    method: 'get',
    params: data

  })
}
