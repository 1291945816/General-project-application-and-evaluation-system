import request from '@/utils/request'

/**
 * 获取所有专业
 * @param {*} params
 */
export function getAllMajors(params) {
  return request(
    {
      url: '/api/major/show',
      method: 'get',
      params
    }
  )
}

/**
 * 获取专业数量
 */
export function getMajorCount() {
  return request({
    url: '/api/major/count',
    method: 'get'
  })
}

/**
 * 更新专业信息
 * @param {*} data
 */
export function updateMajorInfo(data) {
  return request({
    url: '/api/major/alter',
    method: 'post',
    data
  })
}

/**
 * 添加专业信息
 */
export function addMajorInfo(data) {
  return request({
    url: '/api/major/add',
    method: 'post',
    data
  })
}

/**
 * 删除专业信息
 */
export function deleteMajorInfo(params) {
  return request({
    url: '/api/major/del',
    method: 'get',
    params
  })
}
/**
 * 按学院查找 得到学院下的所有专业
 */
export function getMajorInfoByCollege(params) {
  return request({
    url: '/api/major/getByCollege',
    method: 'get',
    params
  })
}
