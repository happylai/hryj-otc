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

export function cancel_num_save(data) {
  return request({
    url: `/admin/dictionary/cancel_num_save`,
    method: 'post',
    data: data
  })
}
