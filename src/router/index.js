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
  name: 'order_manage',
  meta: {
    title: '订单管理',
    icon: 'orderList',
    authName: ['order_list', 'order_withdraw', 'order_appeal']
  },
  children: [{
    path: 'index',
    name: 'order_list',
    component: () => import('@/views/order/index'),
    meta: {
      title: '订单列表',
      icon: '',
      authName: ['order_list']

    }
  },
  {
    path: 'withdraw',
    name: 'order_withdraw',
    component: () => import('@/views/order/withdraw'),

    meta: {
      title: '出金列表',
      icon: '',
      authName: ['order_withdraw']

    }
  },
  {
    path: 'appeal',
    name: 'order_appeal',
    component: () => import('@/views/order/appeal'),
    // redirect: '/order/appeal/list',

    meta: {
      title: '订单申诉',
      icon: '',
      authName: ['order_appeal']

    }
  },
  {
    path: 'withdrawList',
    name: 'order_withdrawList',
    component: () => import('@/views/order/withdrawList'),
    // redirect: '/order/appeal/list',

    meta: {
      title: '提现列表',
      icon: '',
      authName: ['order_appeal']

    }
  },
  {
    path: 'reedit',
    name: 'order_reedit',
    component: () => import('@/views/order/reedit'),
    // redirect: '/order/appeal/list',

    meta: {
      title: '补单',
      icon: '',
      authName: ['order_reedit']

    }
  },
  {
    path: 'reedit/:id',
    name: 'order_reedit',
    component: () => import('@/views/order/reedit/detail'),
    // redirect: '/order/appeal/list',
    hidden: true,
    meta: {
      title: '补单详情',
      icon: '',
      activeMenu: '/order/reedit',
      authName: ['order_reedit']

    }
  },
  {
    path: 'appeal/:id',
    name: 'appealDetail',
    component: () => import('@/views/order/appealDetail'),
    hidden: true,
    meta: {
      title: '申诉详情',
      activeMenu: '/order/appeal',
      icon: '',
      authName: ['order_appeal']

    }
  }

  ]
},
{
  path: '/user',
  component: Layout,
  name: 'user_manage',
  meta: {
    title: '用户管理',
    icon: 'user',
    authName: ['user_instation', 'user_store', 'user_anget', 'user_role_apply']

    // roles: ['ROLE_USER']
  },
  children: [
    {
      path: 'instation',
      name: 'user_instation',
      component: () => import('@/views/user/instation'),
      meta: {
        title: '站内用户',
        icon: '',
        authName: ['user_instation']

      }
    },
    {
      path: 'store',
      name: 'user_store',
      component: () => import('@/views/user/store'),
      meta: {
        title: 'B端商户',
        icon: '',
        authName: ['user_store']

      }
    },

    {
      path: 'agent',
      name: 'user_anget',
      component: () => import('@/views/user/agent'),
      meta: {
        title: '代理商',
        icon: '',
        authName: ['user_anget']

      }
    },
    {
      path: 'agent/:id',
      hidden: true,
      name: 'user_anget_detail',
      component: () => import('@/views/user/agentDetail'),
      meta: {
        title: '详情',
        icon: '',
        activeMenu: '/user/agent',

        authName: ['user_anget']

      }
    },
    {
      path: 'role',
      name: 'user_role_apply',
      component: () => import('@/views/user/role/main'),
      meta: {
        title: '角色申请',
        icon: '',
        authName: ['user_role_apply']

      },
      children: [
        {
          path: '/role',
          name: 'roleApply',
          component: () => import('@/views/user/role/index'),
          meta: {
            title: '角色申请',
            icon: '',
            authName: ['user_role_apply']

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
            activeMenu: '/user/role',
            authName: ['user_role_apply']

          }
        }
      ]
    },
    {
      path: 'level',
      name: 'user_level',
      component: () => import('@/views/user/level'),
      meta: {
        title: '邀请关系',
        icon: '',
        authName: ['user_level']

      }
    },
    {
      path: 'instation/:id',
      hidden: true,
      name: 'user_instation_detail',
      component: () => import('@/views/user/userDetail'),
      meta: {
        title: '详情',
        icon: '',
        type: 1,
        activeMenu: '/user/instation',
        authName: ['user_instation']

      }
    },
    {
      path: 'store/:id',
      hidden: true,
      name: 'user_store_detail',
      component: () => import('@/views/user/userbDetail'),
      meta: {
        title: '详情',
        icon: '',
        type: 2,
        activeMenu: '/user/store',
        authName: ['user_store']

      }
    }

  ]

},
{
  path: '/advertising',
  component: Layout,
  name: 'advertising_manage',
  meta: {
    title: '广告',
    icon: 'iconguanggaoguanli',
    authName: ['advertising_list']

    // roles: ['ROLE_USER']
  },
  children: [{
    path: '/advertising',
    name: 'advertising_list',
    component: () => import('@/views/advertisement/index'),
    meta: {
      title: '广告管理',
      icon: 'ad-manage',
      authName: ['advertising_list']

    }
  },
  {
    path: ':id',
    hidden: true,
    name: 'advertingDetail',
    component: () => import('@/views/advertisement/detail'),
    meta: {
      title: '详情',
      icon: '',
      activeMenu: '/advertising',
      authName: ['advertising_list']

    }
  }
  ]
},
{
  path: '/message',
  component: Layout,
  name: 'message',
  meta: {
    title: '消息中心',
    icon: 'chat',
    authName: ['message_chat', 'message_system', 'order_list']

  },
  children: [
    {
      path: 'system',
      name: 'message_system',
      component: () => import('@/views/message/system'),
      meta: {
        title: '系统公告',
        authName: ['message_system', 'order_list']

      }
    },

    {
      path: 'chatList',
      name: 'message_chat_friend',
      component: () => import('@/views/message/index'),
      meta: {
        title: '聊天列表',
        authName: ['message_chat', 'order_list']

      }
    },
    {
      path: 'friend',
      name: 'message_chat_friend',
      component: () => import('@/views/chat/friend'),
      meta: {
        title: '系统客服',
        authName: ['message_chat', 'order_list']

      }
    },
    {
      path: 'chat/:id',
      name: 'message_chat',
      hidden: true,
      component: () => import('@/views/message/chat'),
      meta: {
        title: '系统客服',
        authName: ['message_system', 'order_list']

      }
    },
    {
      path: 'system/new',
      name: 'message_system_new',
      hidden: true,
      component: () => import('@/views/message/info'),
      meta: {
        title: '新增',
        icon: '',
        activeMenu: '/message/system',
        authName: ['message_system']

      }
    },
    {
      path: 'system/:id',
      name: 'chat',
      hidden: true,
      component: () => import('@/views/message/info'),
      meta: {
        title: '详情',
        icon: '',
        activeMenu: '/message/system',
        authName: ['message_system']

      }
    }
  ]

},
{
  path: '/finance',
  component: Layout,
  name: 'finance_manage',
  meta: {
    title: '财务管理',
    icon: 'finance',
    authName: ['finance_center', 'finance_user']

  },
  children: [{
    path: 'center',
    name: 'finance_center',
    component: () => import('@/views/finance/center'),
    meta: {
      title: '中央财务',
      icon: '',
      authName: ['finance_center']

    }
  },
  {
    path: 'user',
    name: 'finance_user',
    component: () => import('@/views/finance/user'),
    meta: {
      title: '用户资产',
      icon: '',
      authName: ['finance_user']

    }
  }
  ]
},

{
  path: '/records',
  name: 'records_center',
  component: Layout,
  meta: {
    title: '数据中心',
    icon: 'iconshujuzhongxin',
    authName: ['records_statistics']

  },
  children: [{
    path: 'statistics',
    name: 'records_statistics',
    component: () => import('@/views/analysis/index'),
    meta: {
      title: '数据统计',
      icon: 'statistic',
      authName: ['records_statistics']

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
  name: 'parameter_config',
  path: '/parameter',
  component: Layout,
  meta: {
    title: '参数设置',
    icon: 'params',
    authName: ['parameter_price', 'parameter_agent_award', 'parameter_allowance', 'parameter_commission', 'parameter_time', 'parameter_other']

    // roles: ['ROLE_USER']
  },
  children: [{
    path: 'price',
    name: 'parameter_price',
    component: () => import('@/views/params/priceRules'),
    meta: {
      title: '定价规则',
      icon: '',
      authName: ['parameter_price']

    }
  },
  {
    path: 'agentAward',
    name: 'parameter_agent_award',
    component: () => import('@/views/params/agent'),
    meta: {
      title: '代理奖励',
      icon: '',
      authName: ['parameter_agent_award']

    }
  },
  {
    path: 'allowance',
    name: 'parameter_allowance',
    component: () => import('@/views/params/allowance'),
    meta: {
      title: '补贴奖励',
      icon: '',
      type: 1,
      authName: ['parameter_allowance']

    }
  },
  {
    path: 'commission',
    name: 'parameter_commission',

    component: () => import('@/views/params/allowance'),
    meta: {
      title: 'B端手续费',
      icon: '',
      type: 2,
      authName: ['parameter_commission']

    }
  },
  {
    path: 'time',
    name: 'parameter_time',
    component: () => import('@/views/params/time'),
    meta: {
      title: '时间设置',
      icon: '',
      authName: ['parameter_time']

    }
  },
  {
    path: 'other',
    name: 'parameter_other',
    component: () => import('@/views/params/other'),
    meta: {
      title: '其他参数设置',
      icon: '',
      authName: ['parameter_other']

    }
  }
  ]
},

{
  name: 'system_config',
  path: '/system',
  component: Layout,
  meta: {
    title: '系统设置',
    icon: 'setting',
    authName: ['system_roles_manage', 'system_permission', 'system_admin_user']

  },
  children: [
    {
      path: 'roles',
      name: 'system_roles_manage',
      component: () => import('@/views/system/roles'),
      meta: {
        title: '后台角色管理',
        icon: '',
        authName: ['system_roles_manage']

      }
    },
    {
      path: 'permission',
      name: 'system_permission',
      component: () => import('@/views/system/permission'),
      meta: {
        title: '权限设置',
        icon: '',
        authName: ['system_permission']

      }
    },
    {
      path: 'user',
      name: 'system_admin_user',
      component: () => import('@/views/system/user'),
      meta: {
        title: '后台用户列表',
        icon: '',
        authName: ['system_admin_user']

      }
    },
    {
      path: 'services',
      name: 'system_services',
      component: () => import('@/views/system/services'),
      meta: {
        title: '后台客服列表',
        icon: '',
        authName: ['system_admin_user']

      }
    },
    {
      path: 'logs',
      name: 'system_admin_logs',
      component: () => import('@/views/system/logs'),
      meta: {
        title: '操作日志',
        icon: '',
        authName: ['system_admin_user']

      }
    }
  ]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true,
  meta: {
    authName: ['all']

  }

}
]

const createRouter = () => new Router({
  mode: 'history', // require service support
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
