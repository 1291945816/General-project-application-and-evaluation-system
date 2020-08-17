import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    menus: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  // 新增
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // 这说明登陆成功了
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, menus } = data
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        // // 模拟请求数据
        // const menus = [
        //   {
        //     'path': '/pn',
        //     'name': 'Pn',
        //     'component': 'Layout',
        //     'redirect': '/publicNotification',
        //     'children': [{
        //       'path': '/publicNotification',
        //       'name': 'PublicNotification',
        //       'component': 'notification/PublicNotification',
        //       'meta': {
        //         'title': '发布通知',
        //         'icon': 'notification'
        //       }
        //     }
        //     ]
        //   },
        //   {
        //     'path': '/um',
        //     'name': 'Um',
        //     'component': 'Layout',
        //     'redirect': '/studentInfo',
        //     'meta': {
        //       'title': '用户管理',
        //       'icon': 'User Service'
        //     },
        //     'children': [{
        //       'path': '/studentInfo',
        //       'name': 'StudentInfo',
        //       'component': 'admin/userManagement/StudentsInfo',
        //       'meta': {
        //         'title': '学生信息',
        //         'icon': 'student'
        //       }
        //     },
        //     {
        //       'path': '/teachersInfo',
        //       'name': 'TeachersInfo',
        //       'component': 'admin/userManagement/TeachersInfo',
        //       'meta': {
        //         'title': '教师信息',
        //         'icon': 'teacher'
        //       }
        //     },
        //     {
        //       'path': '/evaluationexperts',
        //       'name': 'Evaluationexperts',
        //       'component': 'admin/userManagement/Evaluationexperts',
        //       'meta': {
        //         'title': '评审专家信息',
        //         'icon': 'expert'
        //       }
        //     }
        //     ]
        //   },
        //   {
        //     'path': '/ar',
        //     'name': 'Ar',
        //     'component': 'Layout',
        //     'redirect': '/arrReviewexperts',
        //     'meta': {
        //       'title': '评审管理',
        //       'icon': 'preview_manage-01'
        //     },
        //     'children': [{
        //       'path': '/arrReviewexperts',
        //       'name': 'ArrReviewexperts',
        //       'component': 'admin/reviewManagement/ArrReviewexperts',
        //       'meta': {
        //         'title': '指定评审专家',
        //         'icon': 'member-experts-pinwx'
        //       }
        //     },
        //     {
        //       'path': '/reviewResult',
        //       'name': 'ReviewResult',
        //       'component': 'admin/reviewManagement/ReviewResult',
        //       'meta': {
        //         'title': '项目评审结果',
        //         'icon': 'result'
        //       }
        //     }
        //     ]
        //   },
        //   {
        //     'path': '/cm',
        //     'name': 'Cm',
        //     'component': 'Layout',
        //     'redirect': '/collegeManagement',
        //     'children': [{
        //       'path': '/collegeManagement',
        //       'name': 'CollegeManagement',
        //       'component': 'admin/CollegeManagement',
        //       'meta': {
        //         'title': '学院管理',
        //         'icon': 'college'
        //       }
        //     }
        //     ]
        //   },
        //   {
        //     'path': '/mm',
        //     'name': 'Mm',
        //     'component': 'Layout',
        //     'redirect': '/majorManagement',
        //     'children': [{
        //       'path': '/majorManagement',
        //       'name': 'MajorManagement',
        //       'component': 'admin/MajorManagement',
        //       'meta': {
        //         'title': '专业管理',
        //         'icon': 'major@2x'
        //       }
        //     }
        //     ]
        //   }
        // ]
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_MENUS', menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

