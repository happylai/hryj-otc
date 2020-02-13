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

// 编辑客服
export function customer_service_update(data) {
  return request({
    url: `/admin/customer_service/update`,
    method: 'post',
    data: data
  })
}

// 修改客服状态
export function customer_service_change_status(data) {
  return request({
    url: `/admin/customer_service/change_status`,
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
// 删除客服
export function customer_service_delete(uuid) {
  return request({
    url: `/admin/customer_service/delete/${uuid}`,
    method: 'post',
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

// 客服查询自己所在群组
export function chat_group_current(meta, data) {
  return request({
    url: `/admin/chat_group/current`,
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

// 将用户移除群组
export function chat_group_remove_user(data) {
  return request({
    url: `/admin/chat_group/remove_user`,
    method: 'post',
    data: data
  })
}

// 删除群组
export function chat_group_delete(data) {
  return request({
    url: `/admin/chat_group/delete`,
    method: 'post',
    data: data
  })
}
// 查询站内用户
export function chat_group_users(meta, data) {
  return request({
    url: `/admin/chat_group/users`,
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}