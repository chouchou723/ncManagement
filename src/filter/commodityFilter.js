import { userName } from 'filter/tenantFilter'

export let cpuFilter = (rule, value, callback)=>{
    if(value == ''){
        callback( new Error('请输入CPU') )
    }else if(value < 1 || value > 16){
        callback( new Error('请输入1-16的整数  单位为 G') )
    }
    callback()
}
export let memoryFilter = (rule, value, callback)=>{
    if(value == ''){
        callback( new Error('请输入内存') )
    }else if(value < 1 || value > 32){
        callback( new Error('请输入1-32的整数  单位为 G') )
    }
    callback()
}

export let diskFilter = (rule, value, callback)=>{
    if(value == ''){
        callback( new Error('请输入磁盘') )
    }else if(value < 10 || value > 1024 ){
        callback( new Error('请输入10-1024的整数  单位为 G') )
    }
    callback()
}

let ipScopeFilter = (rule, value, callback)=>{

    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ ;
   
    if( value == ''){
        callback( new Error('请输入IP地址范围') )
    }else if( !reg.test(value) ){
        callback( new Error('请按规范输入 IP 地址, 例如: 192.168.3.5/17') )
    }
    callback()
}

let subnetMaskFilter = (rule, value, callback)=>{
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ ;
    
    if( !reg.test(value) ){
        callback( new Error('请按对应规范输入正确的值') )
    }
    callback()
}

export const formCheck = {
    name: [
        { validator:userName, required: true, trigger: 'blur' }
    ],
    faIp: [
        { required: true, message:'FusionAccess不能为空', trigger: 'blur' }
    ],
    siteVal: [
        { required: true, message:'站点不能为空', trigger: 'blur' }
    ],
    clusterVal: [
        { required: true, message:'请选择集群', trigger: 'blur' } 
    ],
    portVal: [
        { required: true, message:'请选择端口组', trigger: 'blur' }
    ],
    setIp: [
        { required: true, message: '请选择IP分配方式', trigger: 'blur' }
    ],
    ipScope: [
        { validator: ipScopeFilter, required: true, trigger: 'blur' }
    ],
    subnetMask: [
        { validator: subnetMaskFilter, required: true, trigger: 'blur' }
    ],
    gateway: [
        { validator: subnetMaskFilter, required: true, trigger: 'blur' }
    ],
    dnsServer: [
        { validator: subnetMaskFilter, required: true, trigger: 'blur' }
    ],
    backupDns: [
        { validator: subnetMaskFilter, required: true, trigger: 'blur' }
    ],
    deskType: [
        { required: true, message:'请选择桌面类型', trigger: 'change' }
    ],
    deskgroupVal: [
        { required: true, message:'请选择桌面组', trigger: 'blur' }
    ],
    templateVal: [
        { required: true, message:'请选择模板', trigger: 'blur' }
    ],
    domainVal: [
        { required: true, message:'请选择域', trigger: 'blur' }
    ],
    ouVal: [
        { required: true, message:'请选择OU', trigger: 'blur' }
    ],
    cpu: [
        { validator:cpuFilter, required: true,trigger: 'blur' }
    ],
    memory: [
        { validator:memoryFilter, required: true, trigger: 'blur' }
    ],
    disk: [
        { validator:diskFilter, required: true, trigger: 'blur' }
    ],
    virtualNum: [
        { required: true, message:'请输入虚机数', trigger: 'blur' }
    ],
    prefix: [
        { required: false, message:'请输入识别前缀', trigger: 'blur' }
    ]
}


export let tableHeaderInfo = [
    {type: 'selection',width: '60px'},
    {title: 'id', key: 'datastoreId',width: '60px'},
    {title: '数据储存', key: 'name',width: '110px'},
    {title: '剩余容量 ( GB )', key: 'freeSizeGB',width: '150px'},
    {title: '总容量 ( GB )', key: 'capacityGB',width: '150px'},
    {title: '精简配置', key: 'isThin',width: '100px'},
    {title: '是否虚拟化', key: 'isVirtual',width: '150px'}
]