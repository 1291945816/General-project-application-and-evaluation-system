const Mock = require('mockjs')
const { config } = require('@vue/test-utils')

const data = Mock.mock({
  'items|78': [{
    id: '@integer(50000,60000)',
    title: '@ctitle',
    publicDate: '@datetime',
    publicPerson: '@cname',

    applyTimestart: '@datetime',
    applyTimeend: '@datetime',
    applyYear: '2020',
    reviewTimestart: '@datetime',
    reviewTimeend: '@datetime',
    content: '@cparagraph',
    url: 'https://static.runoob.com/images/demo/demo1.jpg',
    itemcategory: '国家级大创项目'

  }]
})

const student = Mock.mock({
  'items|78': [{
    'user_id|1': ['1800300916', '1800300404', '123456789', '1800300961', '2000300489'],
    'user_name|1': ['张三', '李四', '王五', '哈哈哈哈', '哦哦哦'],
    user_phone: '18777524615',
    'major|1': [{
      major_id: '1',
      major_name: '软件工程'

    }],
    user_email: '1291945816@163.com',
    'role|1': [
      {
        'role_id|1': ['1', '2'],
        'role_name|1': ['学生', '老师']
      }
    ]

  }]
})

const college = Mock.mock({
  'college|135': [{
    id: 'AX4506',
    name: '计算机与信息安全学院'

  }]
})

const major = Mock.mock({
  'major': [{
    major_id: '1',
    major_name: '软件工程'

  }]
})

const role = Mock.mock({
  'role|2': [{
    'role_id|1': ['1', '2'],
    'role_name|1': ['学生', '老师']

  }]
})
module.exports = [
  {
    url: '/vue-admin-template/table/list\.*',
    type: 'get',
    response: config => {
      const { offist, limit } = config.query
      const newData = []
      const off = parseInt(offist) - 1
      const lim = parseInt(limit)
      for (let index = off * 10; index < off * 10 + lim; index++) {
        if (!data.items.length || index >= data.items.length) {
          break
        }
        newData.push(data.items[index])
      }
      return {
        code: 20000,
        data: {
          items: newData
        }
      }
    }
  },
  {
    url: '/api/college/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取成功',
        data: 135
      }
    }

  },
  {
    url: '/api/major/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: major.major
        }
      }
    }
  },

  {
    url: '/api/college/show\.*',
    type: 'get',
    response: config => {
      const { pageNum, limit } = config.query
      const newData = []
      const off = parseInt(pageNum) - 1
      const lim = parseInt(limit)
      for (let index = off * 10; index < off * 10 + lim; index++) {
        if (!college.college.length || index >= college.college.length) {
          break
        }
        newData.push(college.college[index])
      }
      return {
        code: 20000,
        data: newData
      }
    }
  },
  {
    url: '/api/role/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          role: role.role
        }
      }
    }
  },

  {
    url: '/vue-admin-template/user/list\.*',
    type: 'get',
    response: config => {
      const { offist, limit } = config.query
      const newData = []
      const off = parseInt(offist) - 1
      const lim = parseInt(limit)
      for (let index = off * 10; index < off * 10 + lim; index++) {
        if (!student.items.length || index >= student.items.length) {
          break
        }
        newData.push(student.items[index])
      }
      return {
        code: 20000,
        data: {
          items: newData
        }
      }
    }
  },
  {
    url: '/vue-admin-template/table/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          count: 78
        }

      }
    }
  },

  {
    url: '/api/user/search\.*',
    type: 'get',
    response: config => {
      // const { user_id } = config.query
      const data = []
      data.push(student.items[0])
      return {
        code: 20000,
        data: {
          res: data
        }
      }
    }
  }
]

