import request from '@/utils/request'
export function getUserInfo(params) {
  return request({
    // 请求用户信息
    url: '/vue-admin-template/user/list',
    type: 'get',
    params
  })
}

// 获取列表总数
export function getcount() {
  return request({
    url: '/vue-admin-template/table/count',
    method: 'get'
  })
}
// 获取所有专业
export function getAllMajor() {
  return request({
    url: '/api/major/list',
    method: 'get'
  })
}

// 更新学生信息
export function updateUserInfo(data) {
  return request({
    url: '/api/user/updateUserInfo',
    method: 'post',
    data
  })
}

// 新增用户信息

export function addUserInfo(data) {
  return request({
    url: '/api/user/addUserInfo',
    method: 'post',
    data
  })
}
// 删除用户信息
export function delUserInfo(id) {
  return request({
    url: '/api/user/UserInfo/' + id,
    method: 'delete'
  })
}
// 获取所有角色信息

export function getAllRole() {
  return request({
    url: '/api/role/list',
    method: 'get'
  })
}

export function searchUser(params) {
  return request({
    url: '/api/user/search',
    method: 'get',
    params
  })
}
