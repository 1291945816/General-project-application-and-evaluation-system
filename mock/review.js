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

const projectInfo = Mock.mock({
  'item|78': [
    {
      project_id: '@integer(50000,60000)',
      project_name: '@ctitle',
      preject_captain: '张三',
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
  },
  {
    url: '/api/review/getProjectsReviewed\.*',
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
    url: '/api/review/ReviewedCount',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: '获取成功',
        data: 78

      }
    }
  },
  {
    url: '/api/review/projectInfoForReview\.*',
    type: 'get',
    response: config => {
      const { type, pageNum, limit } = config.query
      const newData = []
      const page = parseInt(pageNum) - 1
      const lim = parseInt(limit)
      for (let index = page * 10; index < page * 10 + lim; index++) {
        if (!projectInfo.item.length || index >= projectInfo.item.length) {
          break
        }
        newData.push(projectInfo.item[index])
      }
      return {
        code: 20000,
        message: '执行成功',
        data: newData
      }
    }
  },
  // 应该是根据通知ID来获得项目的总信息
  {
    url: '/api/review/projectCountForReview\.*',
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
