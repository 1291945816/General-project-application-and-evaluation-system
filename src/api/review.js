import request from '@/utils/request'

/**
 *通过指定页码和每页的大小,该接口返回评审专家未评审的项目
 * @param {*} params {pageNum: 页码,limit:限制条数}
 */
export function ProjectNotReviewed(params) {
  return request({
    url: '/api/review/getProjectsNotReviewed',
    method: 'get',
    params
  })
}

/**
 *通过指定页码和每页的大小,该接口返回评审专家已评审的项目
 * @param {*} params {pageNum: 页码,limit:限制条数}
 */
export function ProjectReviewed(params) {
  return request({
    url: '/api/review/getProjectsReviewed',
    method: 'get',
    params
  })
}
/**
 * 查看评审结果
 */

/**
 * 返回未评审的项目总数
 *
 */
export function getNotReviewedCount() {
  return request({
    url: '/api/review/NotReviewedCount',
    method: 'get'
  })
}

/**
 * 返回已评审的项目总数
 */
export function getReviewedCount() {
  return request({
    url: '/api/review/ReviewedCount',
    method: 'get'
  })
}

/**
 * 通过指定通知的Id  用于筛选返回的已评审项目
 */
export function ProjectReviewedByType(params) {
  return request({
    url: '/api/review/getReviewedByType',
    method: 'get',
    params
  })
}

/**
 * 通过指定通知的Id  用于筛选返回的未评审项目
 */
export function ProjectNotReviewedByType(params) {
  return request({
    url: '/api/review/getNotReviewedByType',
    method: 'get',
    params
  })
}

export function reviewResult(data) {
  return request({
    url: '/api/review/addResult',
    method: 'post',
    data
  })
}

/**
 * 撤销评审
 * @param {*} params
 */
export function undoReviewResult(params) {
  return request({
    url: '/api/review/del',
    method: 'get',
    params
  })
}

/**
 * 获取查看评审
 */
export function getReviewResult(params) {
  return request({
    url: '/api/review/getResult',
    method: 'get',
    params
  })
}

/**
 * 上传评审结果
 */
export function updateReviewResult(data) {
  return request({
    url: '/api/review/alterResult',
    method: 'post',
    data
  })
}

/**
 * 这个接口返回项目信息的数据
 */
export function getProjectInfoForReview(params) {
  return request({
    url: '/api/review/projectInfoForReview',
    method: 'get',
    params
  })
}

/**
  * 这个接口返回项目信息的数量
  */
export function getProjectCountForReview(params) {
  return request({
    url: '/api/review/projectCountForReview',
    method: 'get',
    params
  })
}
/**
 * 按项目ID设置评审专家
 */

export function setByProject(data) {
  return request({
    url: '/api/review/setByProject',
    method: 'post',
    data
  })
}

/**
 * 按通知ID设置评审专家
 */

export function setByNotice(data) {
  return request({
    url: '/api/review/setByNotice',
    method: 'post',
    data
  })
}

/**
 * 根据项目id返回评审专家的评审信息
 */
export function getResultAdmin(params) {
  return request({
    url: '/api/review/getResultAdmin',
    method: 'get',
    params
  })
}

/**
 * 按通知ID删除所有评审专家
 */

export function deleteByNotice(data) {
  return request({
    url: '/api/review/deleteByNotice',
    method: 'delete',
    data
  })
}

/**
 * 按批量项目id删除所有评审专家
 */
export function deleteByProject(data) {
  return request({
    url: '/api/review/deleteByProject',
    method: 'delete',
    data
  })
}
