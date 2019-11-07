import request from '@/utils/request'
import qs from 'qs'

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

// 获取B端商户列表
export function users_b(meta, data) {
  return request({
    url: `/admin/user/users_b`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取交易所用户管理列表
export function users_web(meta, data) {
  return request({
    url: `/admin/user/users_web`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// B端商户编辑保存/新增保存
export function user_b_save(data) {
  return request({
    url: `/admin/user/user_b_save`,
    method: 'post',
    data
  })
}

// 交易所用户保存
export function user_web_save(data) {
  return request({
    url: `/admin/user/user_web_save`,
    method: 'post',
    data

  })
}

// 交易所用户详情数据
export function user_web(data) {
  return request({
    url: `/admin/user/user_web`,
    method: 'get',
    params: data

  })
}

// 获取B端商户详情
export function user_b(data) {
  return request({
    url: `/admin/user/user_b`,
    method: 'get',
    params: data

  })
}

// 获取用户支付方式审核
export function pay_type_info(data) {
  return request({
    url: `/admin/user/pay_type_info`,
    method: 'get',
    params: data

  })
}

// 用户支付方式审核
export function pay_type_audit(data) {
  return request({
    url: `/admin/user/pay_type/audit`,
    method: 'post',
    data
  })
}

// 用户支付方式列表查询
export function pay_types(data) {
  return request({
    url: `/admin/user/pay_types`,
    method: 'get',
    params: data

  })
}

// 用户支付方式编辑
export function royalty_save(data) {
  return request({
    url: `/admin/user/royalty_save`,
    method: 'post',
    data
  })
}

// 用户交易冻结
export function freeze_deal(data) {
  return request({
    url: `/admin/user/freeze_deal`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 代理商列表
export function users_agent(meta, data) {
  return request({
    url: `/admin/user/agents`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 代理商详情
export function agent_detail(data) {
  return request({
    url: `/admin/user/agent`,
    method: 'get',
    params: data

  })
}

// 代理商保存/新增
export function agent_save(data) {
  return request({
    url: `/admin/user/agent_save`,
    method: 'post',
    data
  })
}

// 代理商详情页面的下级代理
export function agent_children(meta, data) {
  return request({
    url: `/admin/user/agent/children`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 代理商收益明细列表查询
export function agent_earnings(meta, data) {
  return request({
    url: `/admin/user/agent/earnings`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }

  })
}
