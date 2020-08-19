import request from '@/utils/request'
// 获取通知列表
export function getNotificationList(params) {
  return request({
    url: '/api/notification/list',
    method: 'get',
    params
  })
}
// 获取通知列表的总数
export function getNotificationcount() {
  return request({
    url: '/api/notification/count',
    method: 'get'
  })
}

// 获取模板文件
export function downloadTemplateFile(params) {
  return request({
    url: '/api/notification/downloadTemplateFile',
    method: 'get',
    params
  })
}
