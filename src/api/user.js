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

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
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

/**
 * 更新用户的信息
 */
export function updateUserInfo(data) {
  return request({
    url: '/api/user/info',
    type: 'post',
    data

  })
}

/**
 * 更新用户的密码
 */
export function updatePassword(data) {
  return request(
    {
      url: '',
      type: 'post',
      data
    }
  )
}
