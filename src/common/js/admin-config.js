export default [{
    'id': '1',
    'text': '资源管理',
    'iconfont': 'iconfont icon-xiangmu',
    'url': '/adminM',
    'children': [{
        'id': '1-1',
        'text': '在线资源',
        'url': '/adminOnline',
      },
      {
        'id': '1-2',
        'text': '资源列表',
        'url': '/adminResource',
      },
      {
        'id': '1-3',
        'text': '回收站',
        'url': '/adminRecyle',
      },
      {
        'id': '1-4',
        'text': '白名单',
        'url': '/adminWhite',
      }
    ]
  },
  {
    'id': '2',
    'text': '订单管理',
    'iconfont': 'iconfont icon-baobiaoguanli',
    'url': '/adminOrdM',
    'children': [
      //     {
      //     'id': '2-1',
      //     'text': '待审批',
      //     'url': '/adminApplied',
      //   },
      {
        'id': '2-2',
        'text': '订单列表',
        'url': '/adminOrders',
      }
    ]
  },
  {
    'id': '3',
    'text': '工单管理',
    'iconfont': 'iconfont icon-shengpi',
    'url': '/adminTicketM',
    'children': [{
        'id': '3-1',
        'text': '失败工单',
        'url': '/adminFailed',
      },
      {
        'id': '3-2',
        'text': '工单列表',
        'url': '/adminTicket',
      }
    ]
  },
  {
    'id': '9',
    'text': '用户管理',
    'iconfont': 'iconfont icon-1',
    'url': '/adminNewUser',
    'children': [{
        'id': '9-1',
        'text': '新用户审批',
        'url': '/registerApplied',
      },
      {
        'id': '9-6',
        'text': '用户列表',
        'url': '/userListPage',
      },
      //   {
      //     'id': '9-5',
      //     'text': '云管理员',
      //     'url': '/tenantListPage',
      //   },
      //   {
      //     'id': '9-7',
      //     'text': '在线支持组',
      //     'url': '/onlineSupportGroup',
      //   }, {
      //     'id': '9-8',
      //     'text': '故障报修组',
      //     'url': '/problemRepairGroup',
      //   }
    ]
  },
  {
    'id': '14',
    'text': '商品管理',
    'iconfont': 'iconfont icon-shouhui',
    'url': '/prodM',
    'children': [{
      'id': '14-1',
      'text': '商品配置',
      'url': '/deskConfig',
    }]
  },

  {
    'id': '4',
    'text': '系统管理',
    'iconfont': 'iconfont icon-xitongguanli',
    'url': '/adminSysM',
    'children': [{
        'id': '4-1',
        'text': 'FA配置',
        'url': '/faListPage',
      },
      {
        'id': '8-1',
        'text': 'Licence配置',
        'url': '/licenceManage',
      },
      //   {
      //     'id': '4-2',
      //     'text': '商品配置',
      //     'url': '/deskConfig',
      //   },
      {
        'id': '4-3',
        'text': '系统配置',
        'url': '/sysConfig',
      },

      //   {
      //     'id': '4-9',
      //     'text': 'UNS配置',
      //     'url': '/unsConfig',
      //   },
      //   {
      //     'id': '4-11',
      //     'text': 'OU配置',
      //     'url': '/ouConfig',
      //   },
      //   {
      //     'id': '4-4',
      //     'text': '邮件配置',
      //     'url': '/mailConfig',
      //   },
      //   {
      //     'id': '4-10',
      //     'text': '热线配置',
      //     'url': '/phoneSetting',
      //   },

    ]
  },
  {
    'id': '5',
    'text': '统计分析',
    'iconfont': 'iconfont icon-tongjifenxi',
    'url': '/adminReportM',
    'children': [{
        'id': '5-1',
        'text': '桌面使用统计',
        'url': '/deskUseTotal',
      },
      {
        'id': '5-6',
        'text': '桌面生成时长',
        'url': '/deskOpenTime',
      },
      {
        'id': '5-2',
        'text': '已申请桌面',
        'url': '/appliedDesktopPage',
      },
      {
        'id': '5-3',
        'text': '已清退桌面',
        'url': '/detachedPage',
      }, {
        'id': '5-8',
        'text': '未使用桌面',
        'url': '/unusePage',
      },
      {
        'id': '5-4',
        'text': '用户登录信息',
        'url': '/userLoginPage',
      },
      {
        'id': '5-5',
        'text': '用户操作日志',
        'url': '/operationPage',
      },
      {
        'id': '5-7',
        'text': '用户使用时长',
        'url': '/deskUseTime',
      },


      {
        'id': '5-8',
        'text': '告警信息统计',
        'url': '/warningList',
      }
    ]
  },
  {
    'id': '9',
    'text': '文件中心',
    'iconfont': 'iconfont icon-gongwen',
    'url': '/fileM',
    'children': [
        {
          'id': '9-2',
          'text': '文件归档管理',
          'url': '/fileManage',
        },
        {
          'id': '9-3',
          'text': '用户空间管理',
          'url': '/fileUserManagement',
        },
        {
        'id': '9-1',
        'text': '文件操作日志',
        'url': '/fileOperation',
      },
      {
        'id': '9-4',
        'text': '文件使用情况',
        'url': '/fileReport',
      },
    ]
  },
  {
    'id': '6',
    'text': '帮助中心',
    'iconfont': 'el-icon-question',
    'url': '/adminHelpM',
    'children': [{
        'id': '6-1',
        'text': '云社区',
        'url': '/userHelpList',
      },
      {
        'id': '6-2',
        'text': '故障报修',
        'url': '/userOnlineSupport',
      },
      {
        'id': '7-1',
        'text': '推送内容',
        'url': '/noticeList',
      }
      //   {
      //     'id': '6-2',
      //     'text': '板块发布',
      //     'url': '/cateList',
      //   },
    ]
  },
  //   {
  //     'id': '7',
  //     'text': '首页推送',
  //     'iconfont': 'iconfont icon-tongzhi',
  //     'url': '/adminNoticeM',
  //     'children': [{
  //       'id': '7-1',
  //       'text': '推送内容',
  //       'url': '/noticeList',
  //     }]
  //   },
  //   {
  //     'id': '8',
  //     'text': 'Licence管理',
  //     'iconfont': 'iconfont icon-kaoqinliuchengtongji',
  //     'url': '/adminLiceM',
  //     'children': [{
  //       'id': '8-1',
  //       'text': 'Licence配置',
  //       'url': '/licenceManage',
  //     }]
  //   },
]
