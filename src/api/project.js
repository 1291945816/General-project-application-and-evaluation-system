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

/**
 * pageNum
 * Limit=10
 */
/**
 * 获取某用户ID下的所有项目的信息
 */
export function getProjectInfo(params) {
  return request({
    url: '/api/project/Infos',
    method: 'get',
    params
  })
}

/**
 * 获取项目总数
 *
 */
export function getProjectNumber() {
  return request({
    url: '/api/project/count',
    method: 'get'
  })
}

/**
  * pageNum
  * Limit=10
  * type='' //项目类别的ID
  */
export function searchByCondition(params) {
  return request({
    url: '/api/project/search',
    method: 'get',
    params
  })
}

/**
 * 根据项目id删除项目
 */
export function deleteProject(data) {
  return request({
    url: '/api/project/deleteProjectById',
    method: 'delete',
    data
  })
}

/**
 * 更新某个项目的一些信息
 */
export function updateProject(data) {
  return request({
    url: '/api/project/projectInfo',
    method: 'post',
    data
  })
}
