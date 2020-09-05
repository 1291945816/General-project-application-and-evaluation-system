const Mock = require('mockjs')
const { config } = require('@vue/test-utils')
const review = Mock.mock({
  'review|78': [
    {
      project_id: '@integer(50000,60000)',
      project_name: '@ctitle',
      project_intro: '@cparagraph',
      project_type: '国家级大创项目',
      project_status: '评审中'
    }
  ]
})
module.exports = [
  {
    url: '/api/review/getProjectsNotReviewed\.*',
    type: 'get',
    response: config => {
      const { pageNum, limit } = config.query
      const newData = []
      const page = parseInt(pageNum) - 1
      const lim = parseInt(limit)
      for (let index = page * 10; index < page * 10 + lim; index++) {
        if (!review.review.length || index >= review.review.length) {
          break
        }
        newData.push(review.review[index])
      }
      return {
        code: 20000,
        message: '执行成功',
        data: newData
      }
    }
  },
  {
    url: '/api/review/NotReviewedCount',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取成功',
        data: 78

      }
    }
  }
]
