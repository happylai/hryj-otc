import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-ROLE_USER-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['ROLE_USER','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/reg',
    component: () => import('@/views/login/reg'),
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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]


/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'example',roles: ['ROLE_USER']  },
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/order/index'),
        name: 'order',
        meta: { title: '订单列表', icon: 'example' },
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: () => import('@/views/order/withdraw'),
        name: 'order',
        meta: { title: '出金审核', icon: 'example' },
      },
      {
        path: 'appeal',
        name: 'appeal',
        component: () => import('@/views/order/appeal'),
        name: 'appeal',
        meta: { title: '订单申述', icon: 'example' },
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'example',roles: ['ROLE_USER']  },
    children: [
      {
        path: 'payment',
        name: 'user',
        component: () => import('@/views/user/payment'),
        name: 'user',
        meta: { title: '支付方式审核', icon: 'example' },
      },

      {
        path: 'withdraw',
        name: 'withdraw',
        component: () => import('@/views/order/withdraw'),
        name: 'order',
        meta: { title: '出金审核', icon: 'example' },
      },
      {
        path: 'appeal',
        name: 'appeal',
        component: () => import('@/views/order/appeal'),
        name: 'appeal',
        meta: { title: '订单申述', icon: 'example' },
      }
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    meta:{title: '广告', icon: 'example',roles: ['ROLE_USER']},
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        name: 'advertising',
        meta: { title: '广告管理', icon: 'example' },
      }
    ]
  },

  {
    path: '/parameter',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        name: 'parameter',
        meta: { title: '参数设置', icon: 'example' },
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        name: 'system',
        meta: { title: '系统管理', icon: 'example' },
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        name: 'finance',
        meta: { title: '财务管理', icon: 'example' },
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
