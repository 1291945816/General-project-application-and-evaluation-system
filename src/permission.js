import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

const _import = require('./router/_import_' + process.env.NODE_ENV) // 获取组件的方法
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

// 全局前置守卫
router.beforeEach(async(to, from, next) => {
  // 进度条显示
  // start progress bar
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // 判断是否获得了token
  const hasToken = getToken()

  // const hasToken=store.getters.token

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是不是刚进系统 即判断menus有没有
      const hasMenus = store.getters.menus && store.getters.menus.length > 0
      if (hasMenus) {
        next()
      } else {
        try {
          // 获取用户的信息
          await store.dispatch('user/getInfo') // 获取用户的信息
          if (store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }

          const menus = filterAsyncRouter(store.getters.menus) // 1.过滤路由
          router.addRoutes(menus) // 2.动态添加路由
          global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作

          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login //移除token的信息
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单的 可以访问
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 其他的页面需要被重定向到登陆页面

      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

//  遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component) // 导入组件
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
