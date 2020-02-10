import request from '@/utils/request'
const scope = `admin/system/notice`
import qs from 'qs'

// 创建系统公告
export function notice_create(data) {
  console.log('params', data)
  return request({
    url: `${scope}/create`,
    method: 'post',
    data

  })
}

// 删除系统公告
export function notice_delete(data) {
  return request({
    url: `${scope}/delete`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 下架系统公告
export function dis_online(data) {
  return request({
    url: `${scope}/dis_online`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 系统公告列表
export function notice_list(meta, data) {
  console.log('params', data)
  return request({
    url: `${scope}/list`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 上架系统公告
export function notice_online(data) {
  return request({
    url: `${scope}/online`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 公告详情
export function notice_info(data) {
  console.log('params', data)
  return request({
    url: `${scope}/info`,
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
