const Mock = require('mockjs')
const { config } = require('@vue/test-utils')

const major = Mock.mock({
  'major|203': [{
    id: '1',
    name: '软件工程',
    collegeId: '003'
  }]
})
module.exports = [
  {
    url: '/api/major/show\.*',
    type: 'get',
    response: config => {
      const { pageNum, limit } = config.query
      const newData = []
      const off = parseInt(pageNum) - 1
      const lim = parseInt(limit)
      for (let index = off * 10; index < off * 10 + lim; index++) {
        if (!major.major.length || index >= major.major.length) {
          break
        }
        newData.push(major.major[index])
      }
      return {
        code: 20000,
        message: '获取专业成功',
        data: newData
      }
    }
  },
  {
    url: '/api/major/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取专业数量成功',
        data: major.major.length
      }
    }

  }

]
