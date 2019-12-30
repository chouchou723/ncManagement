// import {setWorkOrderState, setBusinessType } from 'api/workOrder'
// import {formatTime} from 'api/common'
// export const tableheader = [
//     {type: 'selection',width: 60},
//     {title:'名称', key:'merName', width:250},
//     {title:'结果', key:'result', width:250},
//     {
//         title:'工单状态', 
//         key:'status', 
//         width:200,
//         render:(h, params)=>{
//             return h('span',setWorkOrderState(params))
//         }
//     },
//     {
//         title:'业务类型', 
//         key:'taskType', 
//         width:180,
//         render:(h, params)=>{
//             return h('span', setBusinessType(params))
//         }
//     },
//     {title:'受理人', key:'dealPerson', width:130},
//     {
//         title:'创建时间', 
//         key:'createTime', 
//         width:235,
//         render:(h, params)=>{
//             return h('span',formatTime(params))
//         }
//     },
// ]