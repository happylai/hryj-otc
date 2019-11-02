import request from '@/utils/request'
import qs from 'qs'
export function time_params(data, meta) {
  console.log('params', data)
  return request({
    url: `/admin/dictionary/time_params`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

export function time_param_save(data) {
  return request({
    url: `/admin/dictionary/time_param_save`,
    method: 'post',
    data: data
  })
}
// 保证金
export function deposits(data, meta) {
  return request({
    url: `/admin/dictionary/deposits`,
    method: 'get',
    params: data
  })
}

export function deposit_save(data) {
  return request({
    url: `/admin/dictionary/deposit_save`,
    method: 'post',
    data: data
  })
}

// 激活金
export function active_golds(data, meta) {
  return request({
    url: `/admin/dictionary/active_golds`,
    method: 'get',
    params: data
  })
}

export function active_gold_save(data) {
  return request({
    url: `/admin/dictionary/active_gold_save`,
    method: 'post',
    data: data
  })
}

// 每日可取消单数
export function cancel_nums(data, meta) {
  return request({
    url: `/admin/dictionary/cancel_nums`,
    method: 'get',
    params: data
  })
}

// 保存/添加每日可取消单数参数配置
export function cancel_num_save(data) {
  return request({
    url: `/admin/dictionary/cancel_num_save`,
    method: 'post',
    data: data
  })
}

export function pricing(data) {
  return request({
    url: `/admin/dictionary/pricing`,
    method: 'get',
    params: data
  })
}

export function pricings(data) {
  return request({
    url: `/admin/dictionary/pricings`,
    method: 'get',
    params: data
  })
}

// 保存定价
export function pricing_save(data) {
  return request({
    url: `/admin/dictionary/pricing_save`,
    method: 'post',
    data: data
  })
}

// 查询系统接单范围
export function groups(data) {
  return request({
    url: `/admin/dictionary/groups`,
    method: 'get',
    params: data
  })
}

// 保存接单范围分组参数
export function group_save(data) {
  return request({
    url: `/admin/dictionary/group_save`,
    method: 'post',
    data: data
  })
}

// 查询分组下的接单范围
export function groups_scopes(data) {
  return request({
    url: `/admin/dictionary/group/scopes`,
    method: 'get',
    params: data
  })
}

// 解散分组，系统分组不能解散
export function group_del(data) {
  return request({
    url: `/admin/dictionary/group_save`,
    method: 'post',
    data: data
  })
}

// 查询补贴类参数列
export function subsidies(data, meta) {
  return request({
    url: `/admin/dictionary/subsidies`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 保存补贴类参数设置
export function subsidy_save(data) {
  return request({
    url: `/admin/dictionary/subsidy_save`,
    method: 'post',
    data: data

  })
}

// 根据固定定价id查询对应的接单范围
export function pricing_scopes(data, meta) {
  return request({
    url: `/admin/dictionary/pricing/scopes`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 保存/新增接单范围
export function scope_save(data) {
  return request({
    url: `/admin/dictionary/pricing/scope_save`,
    method: 'post',
    data: data

  })
}

// 查询可添加到当前分组的接单范围
export function get_group_scopes_add(data, meta) {
  return request({
    url: `/admin/dictionary/group/scopes/add`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 添加接单范围到分组中
export function scopes_add(data) {
  return request({
    url: `/admin/dictionary/group/scopes_add`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 删除接单范围
export function scope_del(data) {
  return request({
    url: `/admin/dictionary/pricing/scope_del`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

