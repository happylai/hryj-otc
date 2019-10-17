import request from '@/utils/request'
import qs from 'qs'
export function time_params(data, meta) {
  console.log('params', data)
  return request({
    url: `/dictionary/time_params`,
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
    url: `/dictionary/time_param_save`,
    method: 'post',
    data: data
  })
}

export function deposits(data, meta) {
  return request({
    url: `/dictionary/deposits`,
    method: 'get',
    params: data
  })
}

export function deposit_save(data) {
  return request({
    url: `/dictionary/deposit_save`,
    method: 'post',
    data: data
  })
}
