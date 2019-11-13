import request from '@/utils/request'
import qs from 'qs'

//
// 数据中心统计数据

export function data_center(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/statistics/data_center`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

