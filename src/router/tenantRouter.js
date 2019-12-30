export const tenantRouter = [{
    path: '/cloudResource',
    name: '资源列表',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloud-resource'),
  },
  {
    path: '/cloudOnline',
    name: '在线资源',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloud-online'),
  },
  {
    path: '/cloudApplied',
    name: '待审批',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloud-order-applied')
  },
  {
    path: '/cloudOrder',
    name: '订单列表',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloudOrder'),
  }, {
    path: '/cloudRecycle',
    name: '回收站',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloudRecycle'),
  },
  {
      path:'/cloudWhite',
      name:'白名单',
      meta:{role:['tenant']},component:()=> import('~cloud/cloudWhite'),
  }, 
  {
    path: '/cloudFailed',
    name: '失败工单',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloud-ticket-failed')
  },
  {
    path: '/cloudTicket',
    name: '工单列表',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/cloud-ticket'),
  },
  {
    path: '/merchandiseSetting',
    name: '商品配置',
    meta: {
      role: ['tenant']
    },
    component: () => import('~cloud/merchandise-setting'),
  },
]
