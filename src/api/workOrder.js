
// import {formatTime} from 'api/common'
// export const selectWorkOrderState = ['开通成功','失败','中断','正在运行']

// export function setWorkOrderState(params){
//     var state = params.row.status
//     if( state == 'SUCCESS'){ 
//         return '开通成功'
//     }else if( state == 'FAILED'){ 
//         return '失败'
//     }else if( state =='ABNORMAL'){ 
//         return '中断'
//     }else if( state == 'RUNNING'){ 
//         return '正在运行'
//     }else { 
//         return state
//     }
// }

// export function setBusinessType( params ){
//     let state = params.row.taskType
//     if( state == 'provide'){
//         return '桌面申请'
//     }else if( state == 'detach'){ 
//         return '桌面清退'
//     }else if( state == 'attachVolume'){ 
//         return '修改桌面磁盘'
//     }else if( state == 'postpone'){ 
//         return '延期申请'
//     }else if( state == 'modifyVMStandard'){ 
//         return '桌面规格申请'
//     }else if( state == 'renameDesktop'){ 
//         return '修改桌面名称'
//     }
// }

// export const tableheader = [
//     {type: 'selection',width: 60},
//     {title:'申请人', key:'user',width:140},
//     {title:'名称', key:'merName',width:180},
//     {title:'描述', key:'result',width:200},
//     {title:'CPU/内存/磁盘', key:'feature',width:190},
//     {
//         title:'工单状态', 
//         key:'status',
//         width:140,
//         render:(h, params)=>{
//             return h('span', setWorkOrderState(params))
//         }
//     },
//     {
//         title:'业务类型', 
//         key:'taskType',
//         width:120,
//         render:(h, params)=>{
//             return h('span',setBusinessType(params))
//         }
//     },
//     {
//         title:'创建时间', 
//         key:'createTime',
//         width:200,
//         render:(h, params)=>{
//             return h('span',formatTime(params))
//         }
//     },
//     {
//         title:'详情', 
//         key:'taskID',
//         width:100,
//         render:(h, params)=>{
//             return h('a','详情')
//         }
//     }
// ]