import request from '@/utils/request'

import axios from 'axios'
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
export function downloadTemplateFile(header, id) {
  return axios.get('http://localhost:61000/api/notification/downloadTemplateFile/' + id, {
    params: {},
    responseType: 'blob',
    headers: header
  }
  )
}

// 更新通知信息
export function upNotificationInfo(data) {
  return request({
    url: '/api/notification/upNotificationInfo',
    method: 'post',
    data
  })
}
// 删除单个通知
export function deleteNotificationInfo(id) {
  return request({
    url: '/api/notification/notification/' + id,
    method: 'delete'
  })
}

// 删除模板文件
export function deleteTemplateFile(id) {
  return request({
    url: '/api/notification/deleteTemplateFile/' + id,
    method: 'delete'
  })
}

// 新增通知消息
export function newNotificationInfo(data) {
  return request({
    url: '/api/notification/newNotificationInfo',
    method: 'post',
    data
  })
}
