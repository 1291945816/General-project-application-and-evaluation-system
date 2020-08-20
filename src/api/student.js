import request from '@/utils/request'
export function getStudentInfo(params) {
  return request({
    // 请求学生信息
    url: '/vue-admin-template/student/list',
    type: 'get',
    params
  })
}

// 获取列表总数
export function getcount() {
  return request({
    url: '/vue-admin-template/table/count',
    method: 'get'
  })
}
// 获取所有专业
export function getAllMajor() {
  return request({
    url: '/api/major/list',
    method: 'get'
  })
}

// 更新学生信息
export function updateStudenInfo(data) {
  return request({
    url: '/api/student/updateStudentInfo',
    method: 'post',
    data
  })
}

// 新增学生信息

export function addStudentInfo(data) {
  return request({
    url: '/api/student/addStudentInfo',
    method: 'post',
    data
  })
}
// 删除学生信息
export function delStudentInfo(id) {
  return request({
    url: '/api/student/StudentInfo/' + id,
    method: 'delete'
  })
}
