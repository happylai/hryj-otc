import request from '@/utils/request'

// 获取后台角色列表
export function role_list(meta, data) {
  console.log('params', data)
  return request({
    url: `/admin/role/roles`,
    method: 'get',
    params: data,
    headers: {
      ...meta,
      'Content-Type': 'application/json'
    }
  })
}

//
// 添加/保存角色
export function role_save(data) {
  return request({
    url: `/admin/role/save`,
    method: 'post',
    data: data
  })
}

// 删除角色
export function role_delete(data) {
  return request({
    url: `/admin/role/delete`,
    method: 'post',
    params: data
  })
}

// 批量删除角色权限
export function role_permission_delete(data) {
  return request({
    url: `/admin/role/permission_delete`,
    method: 'post',
    params: data
  })
}

// 保存角色权限
export function role_permission_add(data) {
  return request({
    url: `/admin/role/permission_add`,
    method: 'post',
    data: data
  })
}

// 获取所有权限列表
export function all_permission_list() {
  return request({
    url: `/admin/permission/permissions`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取角色对应的权限列表
export function role_permission_list(roleId) {
  return request({
    url: `/admin/role/permission/${roleId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取当前角色可添加的权限列表
export function current_permission_add_list(roleId) {
  return request({
    url: `/admin/role/permission/add_list/${roleId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
