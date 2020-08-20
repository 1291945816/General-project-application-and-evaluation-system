const Mock = require('mockjs')

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
    user_id: '1800300916',
    user_name: '黄丕松',
    user_phone: '18777524615',
    user_major: '软件工程',
    user_email: '1291945816@163.com'

  }]
})

const major = Mock.mock({
  'major|10': [{
    major_id: '@id',
    major_name: '@cname'

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
    url: '/vue-admin-template/student/list\.*',
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
  }
]

