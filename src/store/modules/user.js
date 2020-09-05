import { login, logout, getInfo } from '@/api/user'
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
        commit('SET_TOKEN', data.token)

        setToken(data.token) // 记得保存token
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
      getInfo('editor').then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { user_id, menus, user_name, user_phone, user_email, user_major } = data
        if (menus === null) {
          console.log('输出为null')
        }
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_MENUS', menus)
        commit('SET_USER_ID', user_id) // 存入用户名
        commit('SET_USER_NAME', user_name)
        commit('SET_USER_PHONE', user_phone)
        commit('SET_USER_EMAIL', user_email)
        commit('SET_USER_MAJOR', user_major)
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

