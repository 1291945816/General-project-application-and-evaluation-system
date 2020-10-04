import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    menus: '',
    user_id: '',
    user_name: '',
    user_phone: '',
    user_email: '',
    user_major: ''

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
  // 新增
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_USER_NAME: (state, user_name) => {
    state.user_name = user_name
  },
  SET_USER_PHONE: (state, user_phone) => {
    state.user_phone = user_phone
  },
  SET_USER_EMAIL: (state, user_email) => {
    state.user_email = user_email
  },
  SET_USER_MAJOR: (state, user_major) => {
    state.user_major = user_major
  },
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
        commit('SET_TOKEN', data)
        // console.log(data)
        setToken(data) // 保存token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 根据用户名获取信息
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { menus, userinfo } = data
        if (menus === null) {
          console.log('输出为null')
        }
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_MENUS', menus)
        commit('SET_USER_ID', userinfo.user_no) // 存入用户名
        commit('SET_USER_NAME', userinfo.user_name)
        commit('SET_USER_PHONE', userinfo.user_phone)
        commit('SET_USER_EMAIL', userinfo.user_email)
        commit('SET_USER_MAJOR', userinfo.major)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
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

