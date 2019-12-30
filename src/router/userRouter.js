export const userRouter = [
    {

        path: '/resourceList',
        name: '资源列表',
        meta: {
          role: ['asset']
        },
        component: () => import('~system/adminResource'),
      },
  {
    name: '我的桌面',
    path: '/myDesk',
    meta: {
      role: ['user','support','troubleshooting','asset','tenant']
    },
    component: () => import('~user/my-desk'),
  },
  {
    path: '/deskRecycle',
    name: '回收站',
    meta: {
      role: ['user','support','troubleshooting','asset','tenant']
    },
    component: () => import('~user/deskRecycle'),
  },
  {
    path: '/desktopApply',
    name: '桌面申请',
    meta: {
      role: ['user','support','troubleshooting','asset','tenant']
    },
    component: () => import('~user/desktop-apply'),
  },
  {
    path: '/myOrder',
    name: '我的申请',
    meta: {
      role: ['user','support','troubleshooting','asset','tenant']
    },
    component: () => import('~user/my-order'),
  },
  // {
  //     path:'/myFailed',
  //     name:'失败工单',
  //     meta:{role:['user','support','troubleshooting','asset']},component:()=> import('~user/my-ticket-failed'),
  // },
  {
    path: '/myTicket',
    name: '工单列表',
    meta: {
      role: ['user','support','troubleshooting','asset']
    },
    component: () => import('~user/my-ticket'),
  },



]
