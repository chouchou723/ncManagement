export const commonRouter = [{
    path: '/',
    name: '首页',
    meta: {
      role: []
    },
    component: () => import('~components/common/dashboard'),
  },
//   {
//     path: '/onlineChat',
//     name: '在线帮助',
//     meta: {
//       role: []
//     },
//     component: () => import('~components/common/onlineChat'),
//   },
//   {
//     path: '/pwdPage',
//     name: '修改密码',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/desktop-pwd'),
//   },
//   // {
//   //     path:'/secretKey',
//   //     name:'我的秘钥',
//   //     meta:{role:['user','support','troubleshooting']},component:()=> import('~user/secret-key'),
//   // },
//   {
//     path: '/appliedDesktopPage',
//     name: '已申请桌面',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/appliedDesktopPage'),
//   },
//   {
//     path: '/detachedPage',
//     name: '已清退桌面',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/detachedPage'),
//   },
//   {
//     path: '/userLoginPage',
//     name: '用户登录信息',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/userLoginPage'),
//   }, {
//     path: '/operationPage',
//     name: '用户操作日志',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/operationPage'),
//   }, {
//     path: '/userHelpList',
//     name: '云社区',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/userHelpList'),
//   }, {
//     path: '/userOnlineSupport',
//     name: '故障报修',
//     meta: {
//       role: ['user','admin','tenant','troubleshooting','asset']
//     },
//     component: () => import('~user/userOnlineSupport'),
//   },
//   {
//     path: '/fileManagement',
//     name: '文件管理',
//     meta: {
//       role: []
//     },
//     component: () => import('~user/fileManagement'),
//   },


]
