import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(user_id) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { user_id }
  })
}
/**
 * 用户获取用户信息
 */
export function getInfoAndMenu() {
  return request(
    {
      url: '/api/user/info',
      method: 'get'
    }
  )
}
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
