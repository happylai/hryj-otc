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

