import request from '@/utils/request'
import qs from 'qs'

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

// 订单申诉详情
export function order_appeal_detail(data) {
  return request({
    url: `/admin/order/order/appeal`,
    method: 'get',
    params: data
  })
}

// 订单申诉列表
export function order_appeals_list(meta, data) {
  return request({
    url: `/admin/order/order/appeals`,
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
    url: `/admin/order/order/appeal_audit`,
    method: 'post',
    data: data
  })
}

// 出金审核列表
export function order_out_orders(meta, data) {
  return request({
    url: `/admin/order/out_orders`,
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
    url: `/admin/order/out_order`,
    method: 'get',
    params: data
  })
}

// 出金审核
export function out_order_audit(data) {
  return request({
    url: `/admin/order/out_order_audit`,
    method: 'post',
    data: data
  })
}

// 订单补单列表
export function order_reorders(meta, data) {
  return request({
    url: `/admin/order/order/reorders`,
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
    url: `/admin/order/order/reorder`,
    method: 'get',
    params: data
  })
}

// 系统补单
export function order_redo(data) {
  return request({
    url: `/admin/order/order/order_redo`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

