import request from '@/utils/request'

/**
 * 用户登录
 * @param {*} data
 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'

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
