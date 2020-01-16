import request from '@/utils/request'
import qs from 'qs'
const scope = `/admin/order`

export function getList(params) {
  console.log('params', params)
  return request({
    url: '${scope}/orders',
    method: 'get'
    // params
  })
}

// 交易明细列表
export function order_details(meta, data) {
  console.log('order_details meta', meta)
  return request({
    url: `${scope}/order_details`,
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
    url: `${scope}/orders`,
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
    url: `${scope}/order`,
    method: 'get',
    params: data
  })
}

// 订单申诉详情
export function order_appeal_detail(data) {
  return request({
    url: `${scope}/order/appeal`,
    method: 'get',
    params: data
  })
}

// 订单申诉列表
export function order_appeals_list(meta, data) {
  return request({
    url: `${scope}/order/appeals`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 订单申诉审核
export function order_appeal_audit(data) {
  return request({
    url: `${scope}/order/appeal_audit`,
    method: 'post',
    data: data
  })
}

// 出金审核列表
export function order_out_orders(meta, data) {
  return request({
    url: `${scope}/out_orders`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 出金审核详情
export function out_order_detail(data) {
  return request({
    url: `${scope}/out_order`,
    method: 'get',
    params: data
  })
}

// 出金审核
export function out_order_audit(data) {
  return request({
    url: `${scope}/out_order_audit`,
    method: 'post',
    data: data
  })
}

// 出金审核记录
export function out_order_reorders(id) {
  return request({
    url: `${scope}/out_order/records/${id}`,
    method: 'get'

  })
}

// 订单补单列表
export function order_reorders(meta, data) {
  return request({
    url: `${scope}/order/reorders`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 订单补发详情
export function order_reorder_detail(data) {
  return request({
    url: `${scope}/order/reorder`,
    method: 'get',
    params: data
  })
}

// 系统补单
export function order_redo(data) {
  return request({
    url: `${scope}/order/order_redo`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 取消订单
export function order_cancel(data) {
  return request({
    url: `${scope}/cancel`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 完结订单
export function order_confirm(data) {
  return request({
    url: `${scope}/confirm`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 补单预处理列表
export function reorder_pres(meta, data) {
  return request({
    url: `${scope}/reorder_pres`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 已处理补单列表
export function pro_order_reorders(meta, data) {
  return request({
    url: `${scope}/reorders`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 处理补单页面
export function pro_order_detail(id) {
  return request({
    url: `${scope}/reorder/${id}`,
    method: 'get'
  })
}

// 创建补单预处理
export function pre_odrder_save(data) {
  return request({
    url: `${scope}/reorder_pre/save`,
    method: 'post',
    data
  })
}

// 删除补单预处理
export function pre_odrder_del(data) {
  return request({
    url: `${scope}/reorder_pre/del`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 补单回调
export function pre_odrder_call_back(data) {
  return request({
    url: `${scope}/reorder/call_back`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 确认补单
export function pre_odrder_confirm(data) {
  return request({
    url: `${scope}/reorder/confirm`,
    method: 'post',
    data
  })
}

// 确认补单
export function pro_odrder_rematch(data) {
  return request({
    url: `${scope}/rematch`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 计算交易总价或数量
export function reorder_calcul(data) {
  return request({
    url: `${scope}/reorder/calcul`,
    method: 'post',
    data
  })
}

// 当前委托
export function withdraw_list(meta, data) {
  return request({
    url: `${scope}/withdraw_list`,
    method: 'get',
    params: data
  })
}

// 订单详情
export function order_info(data) {
  return request({
    url: `${scope}/order`,
    method: 'get',
    params: data
  })
}

