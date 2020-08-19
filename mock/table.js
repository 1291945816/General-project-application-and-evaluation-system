const Mock = require('mockjs')

const data = Mock.mock({
  'items|100': [{
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

module.exports = [
  {
    url: '/vue-admin-template/table/list\.*',
    type: 'get',
    response: config => {
      const { offist, limit } = config.query
      const newData = []
      const off = parseInt(offist)
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
    url: '/vue-admin-template/table/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          count: 100
        }

      }
    }
  }
]

