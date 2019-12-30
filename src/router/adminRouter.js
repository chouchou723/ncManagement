/*
    0   管理员权限   
    1   云管理员权限  
    2   用户权限   
*/

export const adminRouter = [{

    path: '/adminResource',
    name: '资源列表',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminResource'),
  },
  {
    path: '/adminOnline',
    name: '在线资源',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminOnline'),
  },
  {
    path: '/adminRecyle',
    name: '回收站',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminRecyle'),
  }, {
    path: '/adminWhite',
    name: '白名单',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminWhite'),
  },

  {
    path: '/adminApplied',
    name: '待审批',
    meta: {
      role: ['adminNot']
    },
    component: () => import('~system/admin-order-applied')
  },
  {
    path: '/adminOrders',
    name: '订单列表',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminOrders')
  },
  {
    path: '/adminFailed',
    name: '失败工单',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/admin-ticket-failed')
  }, {
    path: '/registerApplied',
    name: '新用户审批',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/registerApplied')
  },
  {
    path: '/adminTicket',
    name: '工单列表',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/adminTicket'),
  },
//   {
//     path: '/cateList',
//     name: '板块发布',
//     meta: {
//       role: ['admin']
//     },
//     component: () => import('~system/cateList'),
//   },
  {
    path: '/faListPage',
    name: 'FA配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/faList'),
  }, {
    path: '/softwareList',
    name: '软件配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/softwareList'),
  }, {
    path: '/softwareApplyOrder',
    name: '软件审批',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/softwareApplyOrder'),
  },
  {
    path: '/deskConfig',
    name: '商品配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/deskConfig'),
  },

  {
    path: '/sysConfig',
    name: '系统配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/sysConfig')
  },
  {
    path: '/unsConfig',
    name: 'UNS配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/unsConfig')
  }, {
    path: '/ouConfig',
    name: 'OU配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/ouConfig')
  }, {
    path: '/phoneSetting',
    name: '热线配置',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/phoneSetting')
  },
  {
    path: '/mailConfig',
    name: "邮件配置",
    meta: {
      role: ['admin']
    },
    component: () => import('~system/mailConfig')
  },
  {
    path: '/tenantListPage',
    name: '云管理员',
    meta: {
      role: ['adminNot']
    },
    component: () => import('~system/tenant-list')

  },
  {
    name: 'Licence配置',
    path: '/licenceManage',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/licenceManage')
  },
  {
    path: '/noticeList',
    name: '推送内容',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/notice-list')
  },
  {
    path: '/userListPage',
    name: '用户列表',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/userListPage'),
  },
  {
    path: '/onlineSupportGroup',
    name: '在线支持组',
    meta: {
      role: ['adminNot']
    },
    component: () => import('~system/onlineSupportGroup'),
  },
  {
    path: '/problemRepairGroup',
    name: '故障报修组',
    meta: {
      role: ['adminNot']
    },
    component: () => import('~system/problemRepairGroup'),
  },
  {
    path: '/deskOpenTime',
    name: '桌面生成时长',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/deskOpenTime'),
  },
  {
    path: '/deskUseTime',
    name: '用户使用时长',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/deskUseTime'),
  },{
    path: '/unusePage',
    name: '未使用桌面',
    meta: {
      role: ['admin','tenant']
    },
    component: () => import('~user/unusePage'),
  },
  {
    path: '/deskUseTotal',
    name: '桌面使用统计',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/deskUseTotal'),
  },
  {
    path: '/warningList',
    name: '告警信息统计',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/warningList'),
  },
  {
    path: '/fileOperation',
    name: '文件操作日志',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/fileOperation'),
  },
  {
    path: '/fileManage',
    name: '文件归档管理',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/fileManage'),
  },
  {
    path: '/fileUserManagement',
    name: '用户空间管理',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/fileUserManagement'),
  },
  {
    path: '/fileReport',
    name: '文件使用情况',
    meta: {
      role: ['admin']
    },
    component: () => import('~system/fileReport'),
  }
  
]
