import request from '@/utils/request'

/**
 * 获取到所有的项目类别
 */
export function getProjectCategory() {
  return request({
    url: '/api/project/category',
    method: 'get'
  })
}
/**
 * 申报项目
 * @param {*} data
 */
export function applyProject(data) {
  return request({
    url: '/api/project/apply',
    method: 'post',
    data
  })
}
