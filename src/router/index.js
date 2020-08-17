import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/userinfo',
    meta: { title: '个人管理', icon: 'user' },
    children: [{
      path: 'userinfo',
      name: 'Userinfo',
      component: () => import('@/views/common-user/userInfo/Userinfo.vue'),
      meta: { title: '基本信息', icon: 'user-info' }
    },
    {
      path: 'edituserinfo',
      name: 'Edituserinfo',
      component: () => import('@/views/common-user/userInfo/EdituserInfo.vue'),
      meta: { title: '修改信息', icon: 'edit-user' }
    }

    ]
  }
]

export const asyncRoutes = [
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
