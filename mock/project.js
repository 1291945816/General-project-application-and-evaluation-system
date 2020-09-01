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
const Info = Mock.mock({
  'info': [
    {
      project_id: '12355',
      project_name: '基于大数据平台的数据清洗智云平台',
      project_intro: '绍，这是一个介绍',
      project_status: '申报中',
      project_category: { id: '0001', name: '国家级项目' },
      project_teacher: { id: '1800300916', name: '黄丕松', email: '', phone: '18777524615', major: '软件工程' },
      project_identity: '指导老师',
      project_member: [{ id: '1', name: '黄丕松', email: 'mac1291945816@163.com', phone: '18777524615', major: '软件工程' }, { id: '2', name: '黄丕松', email: 'mac1291945816@163.com', phone: '18777524615', major: '软件工程' }],
      project_review: ['不错啊', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放']
    },
    {
      project_id: '4688877',
      project_teacher: { id: '1800300916', name: '黄丕松', email: '', phone: '18777524615', major: '软件工程' },
      project_identity: '成员',
      project_name: '基于大数据平台的测试平台',
      project_category: { id: '0001', name: '国家级项目' },
      project_intro: '这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍，这是一个介绍',
      project_status: '申报中',
      project_member: [{ id: '1', name: '黄丕松', email: '', phone: '18777524615', major: '软件工程' }, { id: '2', name: '黄丕松', email: 'mac1291945816@163.com', phone: '18777524615', major: '软件工程' }, { id: '3', name: '黄丕松', email: 'mac1291945816@163.com', phone: '18777524615', major: '软件工程' }],
      project_review: ['不错啊', '建议加大数据的投放建议加大数据的投放建议加大数据的投放建议加大数据的投放建议加大数据的投放建议加大数据的投放建议加大数据的投放建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放', '建议加大数据的投放']
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
  },
  {
    url: '/api/project/Infos\.*',
    type: 'get',
    response: config => {
      const { pageNum, limit } = config.query
      return {
        code: 20000,
        message: '获取项目信息成功',
        data: Info.info
      }
    }
  },
  {
    url: '/api/project/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取项目信息成功',
        data: 100
      }
    }
  }
]
