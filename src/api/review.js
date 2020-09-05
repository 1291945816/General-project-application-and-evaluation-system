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
