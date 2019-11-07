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
    activeMenu: '//list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
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
    name: '首页',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard'
    }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/order',
  component: Layout,
  meta: {
    title: '订单管理',
    icon: 'orderList'
    // roles: ['ROLE_USER']
  },
  children: [{
    path: 'index',
    name: 'user',
    component: () => import('@/views/order/index'),

    meta: {
      title: '订单列表',
      icon: ''
    }
  },
  {
    path: 'withdraw',
    name: 'withdraw',
    component: () => import('@/views/order/withdraw'),

    meta: {
      title: '出金审核',
      icon: ''
    }
  },
  {
    path: 'appeal',
    name: 'appeal',
    component: () => import('@/views/order/appeal'),
    // redirect: '/order/appeal/list',

    meta: {
      title: '订单申述',
      icon: ''
    }
    // children: [
    //   {
    //     path: 'list',
    //     name: 'appeal',
    //     component: () => import('@/views/order/appeal'),

    //     meta: {
    //       title: '列表',
    //       icon: ''
    //     }
    //   },

    // ]
  },
  {
    path: 'appeal/:id',
    name: 'appealDetail',
    component: () => import('@/views/order/appealDetail'),
    hidden: true,
    meta: {
      title: '申述详情',
      icon: ''
    }
  }

  ]
},
{
  path: '/user',
  component: Layout,
  meta: {
    title: '用户管理',
    icon: 'user'
    // roles: ['ROLE_USER']
  },
  children: [
    //   {
    //   path: 'payment',
    //   name: 'user',
    //   component: () => import('@/views/user/payment'),
    //   meta: {
    //     title: '支付方式审核',
    //     icon: ''
    //   }
    // },
    {
      path: 'instation',
      name: 'instationUser',
      component: () => import('@/views/user/instation'),
      meta: {
        title: '站内用户',
        icon: ''
      }
    },
    {
      path: 'store',
      name: 'storeUser',
      component: () => import('@/views/user/store'),
      meta: {
        title: 'B端商户',
        icon: ''
      }
    },

    {
      path: 'agent',
      name: 'angetUser',
      component: () => import('@/views/user/agent'),
      meta: {
        title: '代理商',
        icon: ''
      }
    },
    {
      path: 'agent/:id',
      hidden: true,
      name: 'angetUser',
      component: () => import('@/views/user/agentDetail'),
      meta: {
        title: '详情',
        icon: ''
      }
    },
    {
      path: 'role',
      name: 'roleApply',
      component: () => import('@/views/user/role/main'),
      meta: {
        title: '角色申请',
        icon: ''
      },
      children: [
        {
          path: '/role',
          name: 'roleApply',
          component: () => import('@/views/user/role/index'),
          meta: {
            title: '角色申请',
            icon: ''
          }
        },
        {
          path: '/role/:id',
          hidden: true,
          name: 'roleApplyDetail',
          component: () => import('@/views/user/role/roleDetail'),
          meta: {
            title: '详情',
            icon: '',
            activeMenu: '/role'
          }
        }
      ]
    },
    {
      path: 'instation/:id',
      hidden: true,
      name: 'userDetail',
      component: () => import('@/views/user/userDetail'),
      meta: {
        title: '详情',
        icon: '',
        type: 1
      }
    },
    {
      path: 'store/:id',
      hidden: true,
      name: 'userDetail',
      component: () => import('@/views/user/userbDetail'),
      meta: {
        title: '详情',
        icon: '',
        type: 2
      }
    }

  ]

},
{
  path: '/advertising',
  component: Layout,
  meta: {
    title: '广告',
    icon: 'iconguanggaoguanli'
    // roles: ['ROLE_USER']
  },
  children: [{
    path: '/advertising',
    name: 'user',
    component: () => import('@/views/advertisement/index'),
    meta: {
      title: '广告管理',
      icon: 'ad-manage'
    }
  },
  {
    path: ':id',
    hidden: true,
    name: 'advertingDetail',
    component: () => import('@/views/advertisement/detail'),
    meta: {
      title: '详情',
      icon: ''
    }
  }
  ]
},
{
  path: '/finance',
  component: Layout,
  meta: {
    title: '财务管理',
    icon: 'finance'
  },
  children: [{
    path: 'center',
    name: 'centerFinance',
    component: () => import('@/views/finance/center'),
    meta: {
      title: '中央财务',
      icon: ''
    }
  },
  {
    path: 'user',
    name: 'userFinance',
    component: () => import('@/views/finance/user'),
    meta: {
      title: '用户资产',
      icon: ''
    }
  }
  ]
},
{
  path: '/analysis',
  component: Layout,
  meta: {
    title: '数据中心',
    icon: 'iconshujuzhongxin'
  },
  children: [{
    path: 'statistics',
    name: 'dataStatistics',
    component: () => import('@/views/analysis/index'),
    meta: {
      title: '数据统计',
      icon: 'statistic'
    }
  }
  // {
  //   path: 'user',
  //   name: 'userFinance',
  //   component: () => import('@/views/order/index'),
  //   meta: {
  //     title: '用户资产',
  //     icon: ''
  //   }
  // }
  ]
},
{
  path: '/parameter',
  component: Layout,
  meta: {
    title: '参数设置',
    icon: 'params'
    // roles: ['ROLE_USER']
  },
  children: [{
    path: 'price',
    name: 'priceParams',
    component: () => import('@/views/params/priceRules'),
    meta: {
      title: '定价规则',
      icon: ''
    }
  },
  {
    path: 'agentAward',
    name: 'agentAward',
    component: () => import('@/views/params/agent'),
    meta: {
      title: '代理奖励',
      icon: ''
    }
  },
  {
    path: 'allowance',
    name: 'parAllowance',
    component: () => import('@/views/params/allowance'),
    meta: {
      title: '补贴奖励',
      icon: '',
      type: 1
    }
  },
  {
    path: 'commission',
    name: 'commission',
    component: () => import('@/views/params/allowance'),
    meta: {
      title: '交易提成',
      icon: '',
      type: 2
    }
  },
  {
    path: 'time',
    name: 'parTime',
    component: () => import('@/views/params/time'),
    meta: {
      title: '时间设置',
      icon: ''
    }
  },
  {
    path: 'other',
    name: 'otherParams',
    component: () => import('@/views/params/other'),
    meta: {
      title: '其他参数设置',
      icon: ''
    }
  }
  ]
},

{
  path: '/system',
  component: Layout,
  meta: {
    title: '系统设置',
    icon: ''
  },
  children: [
    //   {
    //   path: 'roles',
    //   name: 'systemRoles',
    //   component: () => import('@/views/system/roles'),
    //   meta: {
    //     title: '后台角色管理',
    //     icon: ''
    //   }
    // },
    // {
    //   path: 'permission',
    //   name: 'systemPermission',
    //   component: () => import('@/views/system/permission'),
    //   meta: {
    //     title: '权限设置',
    //     icon: ''
    //   }
    // },
    {
      path: 'user',
      name: 'systemUser',
      component: () => import('@/views/system/user'),
      meta: {
        title: '后台用户列表',
        icon: 'userList'
      }
    }
  ]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
