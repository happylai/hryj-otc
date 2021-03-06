import request from '@/utils/request'
import qs from 'qs'

// 获取中央账户财务总览数据

export function finance_central(meta, data) {
  return request({
    url: `/admin/finance/central`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取中央账户每日流水统计
export function finance_central_flow(meta, data) {
  return request({
    url: `/admin/finance/central_flow`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取B端用户资产统计数据
export function finance_user_b(meta, data) {
  return request({
    url: `/admin/finance/user_b`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 获取交易所用户资产统计数据
export function finance_user_web(meta, data) {
  return request({
    url: `/admin/finance/user_web`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}

// 中央系统提现
export function system_central_withdraw(data) {
  return request({
    url: `/admin/finance/system_central_withdraw`,
    method: 'post',
    data: data
  })
}


// 中央系统充值
export function system_central_recharge(data) {
  return request({
    url: `/admin/finance/system_central_recharge`,
    method: 'post',
    data: data
  })
}



// 获取中央账户流水明细
export function central_detail(meta, data) {
  return request({
    url: `/admin/finance/central_detail`,
    method: 'get',
    params: data,
    headers: {
      ...meta
    }
  })
}
