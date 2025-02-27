
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
  1800300916: {
    token: 'user-token'
  }
}
// 模拟请求数据
const menus_admin = [
  {
    'path': '/',
    'name': 'Pn',
    'component': 'Layout',
    'redirect': '/publicNotification',
    'children': [{
      'path': '/publicNotification',
      'name': 'PublicNotification',
      'component': 'notification/PublicNotification',
      'meta': {
        'title': '发布通知',
        'icon': 'notification'
      }
    }
    ]
  },
  {
    'path': '/um',
    'name': 'Um',
    'component': 'Layout',
    'redirect': '/userInfo',
    'children': [{
      'path': '/userInfo',
      'name': 'UserInfo',
      'component': 'admin/userManagement/UserInfo',
      'meta': {
        'title': '用户信息',
        'icon': 'student'
      }
    }
    ]
  },
  {
    'path': '/ar',
    'name': 'Ar',
    'component': 'Layout',
    'redirect': '/arrReviewexperts',
    'meta': {
      'title': '评审管理',
      'icon': 'preview_manage-01'
    },
    'children': [{
      'path': '/arrReviewexperts',
      'name': 'ArrReviewexperts',
      'component': 'admin/reviewManagement/ArrReviewexperts',
      'meta': {
        'title': '指定评审专家',
        'icon': 'member-experts-pinwx'
      }
    },
    {
      'path': '/reviewResult',
      'name': 'ReviewResult',
      'component': 'admin/reviewManagement/ReviewResult',
      'meta': {
        'title': '项目评审结果',
        'icon': 'result'
      }
    }
    ]
  },
  {
    'path': '/cm',
    'name': 'Cm',
    'component': 'Layout',
    'redirect': '/collegeManagement',
    'children': [{
      'path': '/collegeManagement',
      'name': 'CollegeManagement',
      'component': 'admin/CollegeManagement',
      'meta': {
        'title': '学院管理',
        'icon': 'college'
      }
    }
    ]
  },
  {
    'path': '/mm',
    'name': 'Mm',
    'component': 'Layout',
    'redirect': '/majorManagement',
    'children': [{
      'path': '/majorManagement',
      'name': 'MajorManagement',
      'component': 'admin/MajorManagement',
      'meta': {
        'title': '专业管理',
        'icon': 'major@2x'
      }
    }
    ]
  }
]
const menus_editor =
[
  {
    'path': '/',
    'name': 'Notification',
    'component': 'Layout',
    'redirect': '/inform',
    'children': [{
      'path': '/inform',
      'name': 'Infom',
      'component': 'notification/index',
      'meta': {
        'title': '最新通知',
        'icon': 'notification'
      }
    }
    ]
  },
  {
    'path': '/pr',
    'name': 'Pr',
    'component': 'Layout',
    'redirect': '/projectreview',
    'children': [{
      'path': '/projectreview',
      'name': 'Projectreview',
      'component': 'expert/Projectreview',
      'meta': {
        'title': '项目评审',
        'icon': 'review'
      }
    }
    ]
  }

]

const menus_user =
[
  {
    'path': '/',
    'name': 'Notification',
    'component': 'Layout',
    'redirect': '/inform',
    'children': [{
      'path': '/inform',
      'name': 'Infom',
      'component': 'notification/index',
      'meta': {
        'title': '最新通知',
        'icon': 'notification'
      }
    }
    ]
  },
  {
    'path': '/pm',
    'name': 'Pm',
    'component': 'Layout',
    'redirect': '/EditProject',
    'meta':
    {
      'title': '项目管理',
      'icon': 'project'
    },
    'children': [{
      'path': '/editProject',
      'name': 'EditProject',
      'component': 'common-user/pm/Projectdeclaration',
      'meta': {
        'title': '项目申报',
        'icon': 'requests'
      }
    },
    {
      'path': '/projectProcess',
      'name': 'ProjectProcess',
      'component': 'common-user/pm/Process',
      'meta': {
        'title': '申报进度',
        'icon': 'schedule'
      }
    },
    {
      'path': '/projectInfo',
      'name': 'ProjectInfo',
      'component': 'common-user/pm/ProjectInfo',
      'meta': {
        'title': '项目信息',
        'icon': 'Information'
      }
    }
    ]
  }

]
const users = {
  'admin': {
    user_id: 'admin',
    user_name: '张三',
    user_phone: '18777524615',
    user_email: '1291945816@163.com',
    user_major: '001',
    menus: menus_admin
  },
  'editor': {
    user_id: 'editor',
    user_name: '李四',
    user_phone: '18777524615',
    user_email: '1291945816@163.com',
    user_major: '001',
    menus: menus_editor
  },
  '1800300916': {
    user_id: '1800300916',
    user_name: '王五',
    user_phone: '18777524615',
    user_email: '1291945816@163.com',
    user_major: '001',
    menus: menus_user
  }

}

module.exports = [

  /**
   * 模拟用户登录的信息
   */
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '用户或密码错误'
        }
      }
      return {
        code: 20000,
        data: token
      }
    }
  },

  // 获取用户信息
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { user_id } = config.query
      const info = users[user_id]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
