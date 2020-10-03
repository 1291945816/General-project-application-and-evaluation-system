import request from '@/utils/request'
/**
 * 获取评审中/已评审的项目的信息
 */
export function getProjectInfoOnReviewing(params) {
  return request({
    url: '/api/admin/projectInfoOnReviewing',
    method: 'get',
    params
  })
}
/**
 * 获取项目的数量
 */
export function getProjectCountOnReviewing(params) {
  return request({
    url: '/api/admin/projectCountOnReviewing',
    method: 'get',
    params
  })
}
/**
 * 项目更新
 */
export function updateProjectStatus(data) {
  return request({
    url: '/api/admin/updateProjectStatusOnfinal',
    method: 'post',
    data
  })
}
/**
 * 获取专家的评语
 *
 */
export function getResultAdmin(params) {
  return request({
    url: '/api/review/getResultAdmin',
    method: 'get',
    params
  })
}
