import request from '@/utils/request'

/**
 * 获取学院的信息  pageNum 和 Limit
 * @param {*} params
 */
export function getCollegeInfo(params) {
  return request({
    url: '/api/college/show',
    method: 'get',
    params
  })
}

/**
 * 获取学院的数量
 * @param {*} params
 */
export function getCollegecount() {
  return request({
    url: '/api/college/count',
    method: 'get'
  })
}

/**
 *更新学院的信息
 */
export function updateCollegeInfo(data) {
  return request({
    url: '/api/college/alter',
    method: 'post',
    data
  })
}
/**
 * 新增学院的信息
 * @param {*} data
 */
export function addCollegeInfo(data) {
  return request({
    url: '/api/college/add',
    method: 'post',
    data
  })
}
/**
 * 删除学院的信息
 * @param {*} params
 */

export function deleteCollegeInfo(params) {
  return request({
    url: '/api/college/del',
    method: 'get',
    params
  })
}

/**
 * 搜索学院的信息
 * @param {*} params
 */
export function SearchCollegeInfo(params) {
  return request({
    url: '/api/college/searchInfo',
    method: 'get',
    params
  })
}
