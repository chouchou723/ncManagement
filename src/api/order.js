
// import {formatTime} from 'api/common'

// export const selectOrderState = ['审批中','审批通过','已拒绝']

// export const selectBusinessType = ['桌面申请']

// export function setBusinessType(params){
//     var state = params.row.businessType
//     switch( state ){
//         case 'provide':
//             return '桌面申请'
//             break;
//         case 'detach':
//             return '桌面清退'
//             break;
//         case 'attachVolume':
//             return '修改桌面磁盘'
//             break;
//         case 'postpone':
//             return '延期申请'
//             break;
//         case 'modifyVMStandard':
//             return '桌面规格申请'
//             break;
//         case 'renameDesktop':
//             return '修改桌面名称'
//             break;
//     }
// }

// export function setOrderState(params){
//     let state = params.row.orderState
//     switch(state){
//         case 'applied':
//             return '待审批'
//             break;
//         case 'oa_applied':
//             return 'oA审批中'
//             break;
//         case 'approved':
//             return '审批通过'
//             break;
//         case 'oa_approved':
//             return 'OA审批通过'
//             break;
//         case 'reject':
//             return '已拒绝'
//             break;
//         case 'applied':
//             return '待审批'
//             break;
//         default:
//             return state;
//         break;
//     }
// }


// export const tableheader = [
//     {type: 'selection',width: 60},
//     {title: '申请人', key:'userAccount',width:120},
//     {title: '模板名称', key:'name',width:190},
//     {
//         title: '创建时间', 
//         key:'createTime',
//         width:180,
//         render:(h, params)=>{
//             return h('span',formatTime(params))
//         }
//     },
//     {title: 'CPU/内存/磁盘', key:'feature',width:160},
//     {
//         title: '订单状态', 
//         key:'orderState',
//         width:120,
//         render:(h, params)=>{
//             return ('span',setOrderState(params))
//         }
//     },
//     {
//         title: '业务类型', 
//         key:'businessType',
//         width:120,
//         render:(h, params)=>{
//             return ('span',setBusinessType(params))
//         }
//     },
//     {title: '受理人', key:'dealPerson',width:120},
//     {title: '到期日', key:'deadline',width:160},
//     {title: '描述', key:'description',width:200},
//     {
//         title: '详情', 
//         key:'id',
//         width:100,
//         render:(h, params)=>{
//             var id = params.row.id
//             return h('a','详情')
//         }
//     }
// ]
 