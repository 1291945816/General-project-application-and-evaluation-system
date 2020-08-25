const Mock = require('mockjs')
const { config } = require('@vue/test-utils')
const project = Mock.mock({
  'project': [{
    id: '01001',
    name: '科教协同项目'
  },
  {
    id: '01002',
    name: '大学生创新创业项目'
  },
  {
    id: '01003',
    name: '测试测试'
  }

  ]
})
module.exports = [
  {
    url: '/api/project/category',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取项目类别成功',
        data: project.project
      }
    }

  }
]
