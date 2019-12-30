

import { adminRouter } from './adminRouter'
import { tenantRouter } from './tenantRouter'
import { userRouter } from './userRouter'
import { commonRouter } from './commonRouter'

/*
    0   管理员权限    adminIndex
    1   云管理员权限  tenantIndex
    2   用户权限      userIndex
*/
var routerArray = []

export var  routerConfig = routerArray.concat(adminRouter, tenantRouter, userRouter,commonRouter)


