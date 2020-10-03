const Mock = require('mockjs')
const projectInfo = Mock.mock({
  'item|78': [
    {
      project_id: '@integer(50000,60000)',
      project_name: '@ctitle',
      preject_captain: '张三',
      project_type: '国家级大创项目',
      project_status: '评审中'
    }
  ]
})
module.exports = [
  {
    url: '/api/admin/projectInfoOnReviewing\.*',
    type: 'get',
    response: config => {
      const { pageNum, limit, type, keyword } = config.query
      console.log(keyword)
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
  }, {

    url: '/api/admin/projectCountOnReviewing',
    type: 'get',
    response: config => {
      const { type, keyword } = config.query
      return {
        code: 20000,
        message: '执行成功',
        data: 78
      }
    }
  }
]
