import request from '@/utils/request'

// 获取留言版列表
export function message_list(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/board/list`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

// 获取用户留言版列表详情
export function message_detail(id) {
  return request({
    url: `/admin/board/user/${id}`,
    method: 'get'
  })
}

// 获取留言版列表
export function message_reply(data) {
  return request({
    url: `/admin/board/reply`,
    method: 'post',
    data: data
  })
}

// 客服详情

export function customer_service_detail(id) {
  return request({
    url: `/admin/customer_service/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 创建客服
export function customer_service_create(data) {
  return request({
    url: `/admin/customer_service/create`,
    method: 'post',
    data: data
  })
}

// 客服列表
export function customer_service_list(meta, data) {
  return request({
    url: `/admin/customer_service/list`,
    method: 'get',
    params: data,
    headers: {

      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 群组列表
export function chat_group_list(meta, data) {
  return request({
    url: `/admin/chat_group/list`,
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 创建群组
export function chat_group_create(data) {
  return request({
    url: `/admin/chat_group/create`,
    method: 'post',
    data: data
  })
}

// 将用户加入群组
export function chat_group_add_user(data) {
  return request({
    url: `/admin/chat_group/add_user`,
    method: 'post',
    data: data
  })
}
