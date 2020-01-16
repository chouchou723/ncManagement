<template>
  <div id="adminResource" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <!-- <el-input placeholder="请输入IP地址" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input> -->
      <el-select style="width:190px;" placeholder="请选择老师" clearable v-model="applyUser"
        @change="clearData(3)">
        <el-option v-for="(item,index) in teacherList" :key="index" :value="item.label" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <!-- <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyTable"
        @keyup.enter.native="clearData" @clear="clearData(2)">
      </el-input>
    
      <el-select style="width:190px" placeholder="请选择登录状态" clearable v-model="applyLoginState"
        @keyup.enter.native="clearData" @change="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select> -->
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px;" @click="addClassroom"
        icon="el-icon-circle-plus-outline">新增教室
      </el-button>
    </div>
    <div class="table-wrap" id="table-wrap">
      <!-- <div class="newBtnWrap">
        <el-button-group> -->
      <!-- <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('start'))"
            @click="start" icon="el-icon-circle-check-outline">启动</el-button>
  <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('stop'))"
            @click="stop" icon="iconfont icon-zanting" >停止</el-button>
          <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('restart'))"
            @click="restart" icon="el-icon-refresh">重启</el-button> -->
      <!-- <el-button size="small" type="primary" @click="addClassroom" icon="el-icon-circle-check-outline">新增教室
          </el-button>
          <el-button size="small" type="primary" :disabled="multSelection.length===0" @click="updateDesk"
            icon="el-icon-edit-outline">设置登录页</el-button> -->
      <!-- <el-button size="small" type="primary" :disabled="!multSelection[0].id" @click="postpone" icon="el-icon-sort">
            资产转移
          </el-button>
          <el-button size="small" type="danger" :disabled="!(multSelection.length===1&&checkDisable('quit'))"
            @click="detach" icon="el-icon-close">清退</el-button> -->
      <!-- </el-button-group> -->

      <!-- <el-button-group style="float:right;margin-top: 10px;margin-right: 10px;">

          <el-button size="small" type="primary" @click="exportData" icon="el-icon-download">导出</el-button>
        </el-button-group> -->
      <!-- </div> -->
      <!-- @select="checkSelect"  @row-click="rowClick" @selection-change="handleSelectionChangeMerge"  -->
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="roomName" label="教室名称">
          <!-- <template slot-scope="scope">
            大教室1
          </template> -->
        </el-table-column>
        <el-table-column prop="ipArea" label="IP地址区间">
          <!-- <template slot-scope="scope">
            172.16.1.1~172.16.1.18(共18个)
          </template> -->
        </el-table-column>
        <el-table-column prop="teacher" label="教学老师">
        </el-table-column>
        <el-table-column prop="loginType" label="WiPlus登录方式">
          <template slot-scope="scope">
            {{scope.row.loginType.split(',').map(item=>{return loginObjR[item]}).join(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="WiPlus登录背景色">
          <template slot-scope="scope">
            <div class="bgc" :style="{background:scope.row.background}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="prompt" label="WiPlus登录页面文字">
          <!-- <template slot-scope="scope">
            考试机器
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="updateDesk(scope.row)" type="text" style="padding:0">修改</el-button>
            <!-- <el-button @click="assignDesk(scope.row)" type="text" style="padding:0;color:#42b983">分配</el-button> -->
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="user" label="使用人">
        </el-table-column>
        <el-table-column prop="computerName" label="桌面名称" :min-width="150">
        </el-table-column>
         <el-table-column prop="merName" label="所属商品" :min-width="150">
             <template slot-scope="scope">
                 {{scope.row.merName||'(FA同步桌面)'}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="cpuRate" label="CPU使用率" width="100">
             <template slot-scope="scope">
            <div>
              {{scope.row.cpuRate||'0%'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="memoryRate" label="内存使用率" width="100">
             <template slot-scope="scope">
            <div>
              {{scope.row.memoryRate||'0%'}}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="networkDelays" label="网络延迟" width="100">
        </el-table-column> -->
        <!-- <el-table-column prop="operatorAccount" label="审批人" width="100">
        </el-table-column> -->
        <!-- <el-table-column prop="deskType" label="桌面类型" width="120">
          <template slot-scope="scope">
            <div>
              {{clouldType(scope)||'未知'}}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
          <template slot-scope="scope">
            <div>
              {{scope.row.feature}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="runState" label="运行状态" width="100">
          <template slot-scope="scope">
            <div>
              {{runState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="loginState" label="登录状态" width="100">
          <template slot-scope="scope">
            <div>
              {{loginState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="attachState" label="分配状态" width="100">
          <template slot-scope="scope">
            <div>
              {{branchState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opType" label="模式" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.runState === 'stopped'">
              {{opTypeState(scope)}}
            </div>
            <div v-if="scope.row.runState !== 'stopped'">
              <el-radio-group v-model="scope.row.opType" size="mini" @change="maintain(scope)"
                v-loading="loadingRadio&&(btnIndex===scope.row.id)">
                <el-radio-button label="unset">工作模式</el-radio-button>
                <el-radio-button label="set">维护模式</el-radio-button>
              </el-radio-group>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="deadline" label="到期日" width="110">
          <template slot-scope="scope">
            <div style="color:#f10000">
              {{scope.row.deadline}}
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <!-- <div class="total-wrap">
        <label>总数：</label><span class="ps-blue ps-count">{{total}}</span>
        <label>CPU/内存/磁盘：</label><span class="ps-yellow ps-count">{{cpu}}个/{{memory}}G/{{disk}}G</span>
      </div> -->
      <div class="page-wrap">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 设置登录方式 -->
    <!-- <el-dialog title="设置登录页" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='12%' width="40%" @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="登录方式：" :label-width="formLabelWidth" prop="loginType">
          <el-checkbox-group v-model="aform.loginType">
            <el-checkbox-button v-for="login in loginLists" :label="login" :key="login">{{login}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="登录背景色：" :label-width="formLabelWidth" prop="background">
          <el-color-picker v-model="aform.background" :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
        <el-form-item label="登录页面文字：" :label-width="formLabelWidth" prop="prompt">
          <el-input v-model="aform.prompt" placeholder='请输入登录页面的文字' :style='{width:"250px"}'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 新增修改教室  -->
    <el-dialog :title="cform.id?'修改教室':'新增教室'" :visible.sync="transformForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='6%' @close='resetD("transformForm")'>
      <el-form :model="cform" :rules="rules2" ref="cform">

        <!-- <el-form-item label="创建教室个数：" :label-width="formLabelWidth" prop="num">
          <el-input-number v-model="cform.num" controls-position="right" :min="1" :max="1024">
          </el-input-number>
        </el-form-item> -->
        <el-form-item label="教室名称：" :label-width="formLabelWidth" prop="roomName">
          <el-input v-model="cform.roomName" placeholder='请输入教室名称' :style='{width:"250px"}'></el-input>
        </el-form-item>
        <el-form-item label="分配IP区间：" :label-width="formLabelWidth" prop="ipArea">
          <el-input v-model="cform.ipAreaF" placeholder='请输入起始的IP' :style='{width:"250px"}'></el-input>
          <span>~</span>
          <el-input v-model="cform.ipAreaL" placeholder='请输入结束的IP' :style='{width:"250px"}'></el-input>
        </el-form-item>
        <el-form-item label="教学老师：" :label-width="formLabelWidth" prop="teacher">
          <el-select placeholder="请选择教学老师" :style='{width:"250px"}' v-model="cform.teacher">
            <el-option v-for="(item,index) in teacherList" :key="index" :value="item.label" :label="item.label">
              {{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录方式：" :label-width="formLabelWidth" prop="loginType">
          <el-checkbox-group v-model="cform.loginType">
            <el-checkbox-button v-for="login in loginLists" :label="login" :key="login">{{login}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="登录背景色：" :label-width="formLabelWidth" prop="background">
          <el-color-picker v-model="cform.background" :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
        <el-form-item label="登录页面文字：" :label-width="formLabelWidth" prop="prompt">
          <el-input v-model="cform.prompt" placeholder='请输入登录页面的文字' :style='{width:"250px"}'></el-input>
        </el-form-item>
        <!-- <el-form-item label="" :label-width="formLabelWidth">
          <div style="color:#f10000;text-align: left;font-size: 12px;line-height: 20px;">修改成功之后需要重启</div>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="serviceConfirm">确 定</el-button>
        <el-button @click="transformForm = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 增加磁盘 -->
    <!-- <el-dialog title="增加磁盘" :visible.sync="dialogFormVisibleDisk" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='15%' width="30%" @close='resetD("dform")'>
      <el-form :model="dform" :rules="ruled" ref="dform">
        <el-form-item label="磁盘容量(GB)：" :label-width="formLabelWidth" prop="disk">
          <el-input-number v-model="dform.disk" controls-position="right" :min="10" :max="1024">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addDisk('dform')">确 定</el-button>
        <el-button @click="dialogFormVisibleDisk = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 同步桌面 -->
    <!-- <el-dialog title="同步桌面" :visible.sync="dialogFormVisibleSyn" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='15%' width="30%" @close='resetD("sform")'>
      <el-form :model="sform" :rules="rulesyn" ref="sform">
        <el-form-item label="请选择FA：" :label-width="formLabelWidth" prop="fa">
          <el-select style="width:190px;" placeholder="请选择FA" v-model="sform.fa">
            <el-option v-for="(item,index) in faList" :key="index" :value="item.faIP" :label="item.faName">
              {{item.faName}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="synDesk('sform')">确 定</el-button>
        <el-button @click="dialogFormVisibleSyn = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>


<script>
  import {
    httpAjax,
    httpGet,
    computedTableHeight,
    addScrollBar
  } from 'api/common'
  //   import {
  //     selectRunState,
  //     selectLoginState
  //   } from 'api/resources'
  export default {
    data() {
    //   var nan16 = (rule, value, callback) => {
    //     if (value && value % 1 === 0 && value <= 16) {
    //       callback()
    //     } else {
    //       callback('请输入正确的数字')
    //     }
    //   }
    //   var nan32 = (rule, value, callback) => {
    //     if (value && value % 1 === 0 && value <= 32) {
    //       callback()
    //     } else {
    //       callback('请输入正确的数字')
    //     }
    //   }
    //   var subnetMaskFilter = (rule, value, callback) => {
    //     var reg =
    //       /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    //     if (!reg.test(value)) {
    //       callback(new Error('请按对应规范输入正确的值'))
    //     }
    //     callback()
    //   }
      var checkIp = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

        if (!reg.test(this.cform.ipAreaF) || !reg.test(this.cform.ipAreaL)) {
          callback(new Error('请按对应规范输入正确的值'))
        } else if ((this.cform.ipAreaF.replace(/\./g, '') - this.cform.ipAreaL.replace(/\./g, '')) > 0) {
          callback(new Error('请按正确的IP起始结束值'))
        } else {
            let url = 'classroom/checkCrossIp'
            httpAjax(url,{ipArea:this.cform.ipAreaF+'~'+this.cform.ipAreaL}).then(res=>{

                callback(new Error('请按正确的IP起始结束值'))
            })

        }
      }
    //   var nan1024 = (rule, value, callback) => {
    //     if (value && value % 1 === 0 && value <= 1024) {
    //       callback()
    //     } else {
    //       callback('请输入正确的数字')
    //     }
    //   }
    //   var blow255 = (rule, value, callback) => {
    //     if (value && value.length <= 255) {
    //       callback()
    //     } else {
    //       callback('请填写描述')
    //     }
    //   }
      return {
          btnLoadingD:false,
        loginLists: ['教学桌面', '个人桌面'],
        loginObj:{'教学桌面':'teaching','个人桌面':'personal'},
        loginObjR:{'teaching':'教学桌面','personal':'个人桌面'},
        queryUserName: '',
        btnIndex: '',
        btnLoading: false,
        // userListData: [],
        teacherList: [],
        transformForm: false,
        // loadingRadio: false,
        // radio3: '工作模式',
        no: false,
        tableData: [],
        count: 0,
        countTran: 0,
        tableHeight: 400,
        total: 0,
        cpu: 0,
        memory: 0,
        disk: 0,
        vmTableLoadingState: true,
        // selectRunState,
        // selectLoginState,
        currentPage4: 1,
        currentSize: 10,
        // currentPage5: 1,
        // currentSize1: 10,
        multSelection: [],
        // multSelectionADD: [],
        // multSelectionTran: [],
        applyUser: '',
        // applyTable: '',
        // applyState: '',
        // applyLoginState: '',
        loadingState: false,

        text: '请稍后',
        // dialogFormVisible: false,
        cform: {
          id: '',
          //   num: 1,
          roomName: '',
          ipAreaF: '',
          ipAreaL: '',
          teacher: '',
          loginType: ['教学桌面'],
          background: '#296683',
          prompt: ''
        },
        aform: {
          loginType: ['教学桌面'],
          background: '#296683',
          prompt: ''
        },
        predefineColors: [
          '#296683',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
        ],
        rules2: {
          roomName: [{
            required: true,
            message: '请输入教室名称',
            // validator: nan32,
            trigger: 'blur'
          }],
          ipArea: [{
            required: true,
            // message: '请输入IP地址',
            validator: checkIp,
            trigger: 'blur'
          }],
          teacher: [{
            required: true,
            message: '请选择老师',
            // validator: nan32,
            trigger: 'change'
          }],
          //   prompt: [{
          //     // required: true,
          //     message: '请输入教室名称',
          //     // validator: nan32,
          //     trigger: 'blur'
          //   }],
          //   cpu: [{
          //     required: true,
          //     validator: nan16,
          //     trigger: 'blur'
          //   }],
          //   memory: [{
          //     required: true,
          //     validator: nan32,
          //     trigger: 'blur'
          //   }],
          //   disk: [{
          //     required: true,
          //     validator: nan1024,
          //     trigger: 'blur'
          //   }],
          //   specDes: [{
          //     required: true,
          //     validator: blow255,
          //     trigger: 'blur'
          //   }]
        },
        formLabelWidth: '130px',
        inputLabelWidth: '300px',
        // dialogFormVisibleP: false,
        // postform: {
        //   Ftime: ''
        // },
        // postformrule: {
        //   Ftime: [{
        //     required: true,
        //     message: '请选择延长的日期',
        //     // validator: nan32,
        //     trigger: 'blur'
        //   }],
        // },
        // pickerOptions2: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now();
        //   }
        // },
        // dialogFormVisibleDisk: false,
        // dform: {
        //   disk: ''
        // },
        // ruled: {
        //   disk: [{
        //     required: true,
        //     validator: nan1024,
        //     trigger: 'blur'
        //   }],
        // },
        // faList: [],
        // dialogFormVisibleSyn: false,
        // sform: {
        //   fa: ''
        // },
      }
    },
    created() {
      this.getVmList(1)
      this.getTeacherList()
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    methods: {
      getTeacherList() {
        let para = {
          page: 1,
          limit: 10000,
          role: 'tenant',
          //   tag: this.tagState,
          //   ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `user/adminUserList?${Math.random()}`
        httpGet(url, para).then((res) => {
          //   this.tableData = res.data;
          this.teacherList = res.data.map(item => {
            return {
              label: item.name,
              value: item.name
            }
          })
        }).catch((error) => {
          console.log(error)
        })
      },
    //   queryUserList() {
    //     this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
    //     this.multSelectionTran = [];
    //     this.currentPage5 = 1;
    //     this.currentSize1 = 10;
    //     this.postpone();
    //   },
      serviceConfirm() { //新增教室
        // let data = this.multSelection[0]
        // let params = {};
        // params.newUser = this.multSelectionTran[0].domainUserName;
        // params.oldUser = data.computerName.split('\\')[0] + '\\' + data.user;
        // params.vmId = data.vmId;
        // params.siteId = data.siteId;
        // params.faIp = data.faIp;
        // params.computerName = data.computerName;
        this.$refs['cform'].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            let para = {...this.cform};
            let lt = para.loginType.map(item=>{
                return this.loginObj[item]
            }).filter(item=>item)
            // console.log(lt)
            para.loginType = lt.join(',');
            para.ipArea= para.ipAreaF+'~'+para.ipAreaL;
            httpAjax('classroom/saveClassroom', para).then(res => {
              if (res.resultCode == "0") {
                this.$message({
                  type: 'success',
                  message: this.cform.id?'修改成功':'创建成功!'
                });
                this.getVmList()
                this.transformForm = false;
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc || '通讯错误'
                });
              }
              this.btnLoading = false;
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '通讯错误,请刷新页面后访问。'
              });
              this.btnLoading = false;

            })

          }
        })
      },
    //   postpone() { //获取转移名单
    //     let name = this.multSelection[0].user
    //     let url =
    //       `user/adminUserList?&myself=${name}&${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&name=${this.queryUserName}`
    //     httpGet(url).then((res) => {
    //       if (res.data) {
    //         this.userListData = res.data
    //         this.countTran = res.count
    //         this.transformForm = true
    //         this.$nextTick(() => {
    //           addScrollBar('#table-wrapTran', true)
    //         })
    //       } else {
    //         this.$message.error('通信错误')
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   },
    //   maintain(data) { //维护模式
    //     this.btnIndex = data.row.id;
    //     let checkStatus = data.row;
    //     let params = {};
    //     params.vmId = checkStatus.vmId;
    //     params.faIp = checkStatus.faIp;
    //     params.siteId = checkStatus.siteId;
    //     params.opType = checkStatus.opType;
    //     let type = checkStatus.opType === 'set' ? 'unset' : 'set'
    //     this.loadingRadio = true;
    //     // var loadIngNode = psLoadIng('正在切换模式, 请稍后...')
    //     httpAjax('desktop/maintainVM', params).then(res => {
    //       if (res.resultCode == "0") {
    //         this.$message({
    //           type: 'success',
    //           message: '操作成功!切换需要一定时间,请稍后确认'
    //         });
    //         this.getVmList()
    //       } else {
    //         data.row.opType = type;
    //         this.$message({
    //           type: 'error',
    //           message: res.resultDesc || '通讯错误'
    //         });
    //       }
    //       this.loadingRadio = false;
    //     }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '通讯错误,请刷新页面后访问。'
    //       });
    //       this.loadingRadio = false;
    //       data.row.opType = type;
    //     })
    //   },
    //   synDesk(formName) { //同步桌面
    //     var params = {};
    //     params.faIp = this.sform.fa;
    //     this.text = '正在同步,请稍后...';
    //     this.loadingState = true;
    //     httpAjax('desktop/queryVmInfo', params).then(res => {
    //       if (res.success == "success") {
    //         this.$message({
    //           type: 'success',
    //           message: '同步成功!'
    //         });
    //         // this.$alert('同步成功!', '同步桌面', {
    //         //     confirmButtonText: '确定',
    //         //     type: 'success',
    //         //     callback: action => {
    //         //         // this.multSelection = [{disk:0}]
    //         this.getVmList()
    //         //     }
    //         // });
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: '同步失败!'
    //         });
    //       }
    //       this.loadingState = false;
    //       this.dialogFormVisibleSyn = false;
    //     }).catch(() => {
    //       this.loadingState = false;
    //       this.$message({
    //         type: 'error',
    //         message: '通讯错误,请刷新页面后访问。'
    //       });
    //     })
    //   },
    //   refreshData() { //点击同步
    //     httpAjax('system/faList').then(res => {
    //       this.faList = res.data;
    //       this.sform.fa = res.data[0].faIP;
    //       this.dialogFormVisibleSyn = true
    //     }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '通讯错误,请刷新页面后访问。'
    //       });
    //     })
    //   },
      resetD(formName) { //重置
        switch (formName) {
        //   case 'aform':
        //     this.aform = {
        //       id: '',
        //       loginType: ['教学桌面'],
        //       background: '#296683',
        //       prompt: ''
        //     }
        //     this.$refs['aform'].resetFields();
        //     break;
          case 'transformForm':
            this.cform = {
              id: '',
              //   num: 1,
              roomName: '',
              ipAreaF: '',
              ipAreaL: '',
              teacher: '',
              loginType: ['教学桌面'],
              background: '#296683',
              prompt: ''
            }
            this.$refs['cform'].resetFields();
          default:
            break;
        }
      },
    //   updateDisk(data) { //点击增加磁盘
    //     this.multSelectionADD = [data];
    //     this.dform.disk = data.disk;
    //     this.dialogFormVisibleDisk = true;
    //   },
    //   addDisk() { //增加磁盘
    //     this.$refs['dform'].validate((valid) => {
    //       let params = {};
    //       let checkStatus = this.multSelectionADD[0]
    //       params.computerName = checkStatus.computerName;
    //       params.faIp = checkStatus.faIp;
    //       params.vmId = checkStatus.vmId;
    //       params.siteId = checkStatus.siteId;
    //       params.clusterId = checkStatus.clusterId;
    //       params.disk = this.dform.disk;
    //       if (valid) {
    //         this.btnLoading = true;
    //         httpAjax('desktop/attachVolume', params).then(res => {
    //           if (res.resultCode == "0") {
    //             this.$message({
    //               type: 'success',
    //               message: '修改成功! 需要花费一些时间,请耐心等待!'
    //             });
    //             // this.$alert('修改成功! 需要花费一些时间,请耐心等待', '增加磁盘', {
    //             //   confirmButtonText: '确定',
    //             //   type: 'success',
    //             //   callback: action => {
    //             //     // this.multSelection = [{disk:0}]
    //             this.getVmList()
    //             //   }
    //             // });
    //           } else {
    //             this.$message({
    //               type: 'error',
    //               message: res.resultDesc
    //             });
    //           }
    //           this.dialogFormVisibleDisk = false;
    //           this.btnLoading = false;
    //         }).catch(() => {
    //           this.btnLoading = false;
    //         })
    //       } else {
    //         console.log('error submit!!');
    //         return false;
    //       }
    //     });
    //   },
    //   addAccount(formName) { //修改规格
    //     this.$refs[formName].validate((valid) => {
    //       let f = {
    //         ...this.aform
    //       };
    //       if (valid) {
    //         this.btnLoading = true;
    //         httpAjax('desktop/updateInstance', f).then(res => {
    //           if (res.resultCode == "0") {
    //             this.dialogFormVisible = false;
    //             this.$message({
    //               type: 'success',
    //               message: '修改成功,需要重启虚机!'
    //             });
    //             // this.$alert('修改成功,需要重启虚机!', '修改规格', {
    //             //   confirmButtonText: '确定',
    //             //   type: 'success',
    //             //   callback: action => {
    //             this.multSelection = [{
    //               disk: 0
    //             }]
    //             this.getVmList()
    //             //   }
    //             // });
    //           } else {
    //             this.$message({
    //               type: 'error',
    //               message: res.resultDesc
    //             });
    //           }
    //           this.btnLoading = false;
    //         }).catch(() => {
    //           this.btnLoading = false;
    //         })
    //       } else {
    //         console.log('error submit!!');
    //         return false;
    //       }
    //     });
    //   },
    handleClick(data) { //删除
        this.$confirm('确定删除该教室吗?', '删除教室', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoadingD = true;
          let params = {
            id: data.id
          }
          httpAjax('classroom/deleteClassroom', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getVmList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnLoadingD = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnLoadingD = false;
          })
        }).catch(() => {

        })
      },
      addClassroom() { //新增教室
        this.transformForm = true;

      },
      updateDesk(data) { //设置登录页
        // this.aform.cpu = this.multSelection[0].cpu;
        // this.aform.memory = this.multSelection[0].memory;
        // this.aform.disk = this.multSelection[0].disk;
        this.cform.id = data.id;
        this.cform.roomName = data.roomName;
        this.cform.ipAreaF = data.ipArea?data.ipArea.split('~')[0]:'' ;
        this.cform.ipAreaL = data.ipArea?data.ipArea.split('~')[1]:'' ;
        this.cform.teacher = data.teacher;
        this.cform.loginType = data.loginType.split(',').map(item=>{return this.loginObjR[item]});
        this.cform.background = data.background;
        this.cform.prompt = data.prompt;
        this.transformForm = true;
      },
    //   start() { //启动
    //     let params = {};
    //     let checkStatus = this.multSelection[0]
    //     params.vmId = checkStatus.vmId;
    //     params.faIp = checkStatus.faIp;
    //     params.siteId = checkStatus.siteId;
    //     this.text = '正在启动虚机, 请稍后...'
    //     this.loadingState = true;
    //     httpAjax('desktop/start', params).then(res => {
    //       this.loadingState = false;
    //       if (res.resultCode == '0') {
    //         this.$message.success('启动需要一定的时间，请耐心等待!')
    //         // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
    //         //   confirmButtonText: '确定',
    //         //   type: 'success',
    //         //   callback: action => {
    //         //     this.multSelection = [{disk:0}]
    //         //     this.getVmList()
    //         //     // this.$message({
    //         //     //   type: 'info',
    //         //     //   message: `action: ${ action }`
    //         //     // });
    //         //   }
    //         // });
    //         // layer.alert('请通知管理员配置UNS连接地址!', {
    //         //     icon: 5
    //         // });
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: res.resultDesc
    //         });
    //       }
    //       this.multSelection = [{
    //         disk: 0
    //       }]
    //       this.getVmList()
    //     }).catch(() => {
    //       this.loadingState = false;
    //     })
    //   },
    //   stop() {
    //     this.$confirm('确定要停止该桌面?', '停止桌面', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       let params = {};
    //       let checkStatus = this.multSelection[0]
    //       params.vmId = checkStatus.vmId;
    //       params.faIp = checkStatus.faIp;
    //       params.siteId = checkStatus.siteId;
    //       this.text = '正在停止虚机, 请稍后...'
    //       this.loadingState = true;
    //       httpAjax('merchandise/stopInstance', params).then(res => {
    //         this.loadingState = false;
    //         if (res.resultCode == '0') {
    //           this.$message.success('停止虚机成功')
    //           // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
    //           //   confirmButtonText: '确定',
    //           //   type: 'success',
    //           //   callback: action => {
    //           //     this.multSelection = [{disk:0}]
    //           //     this.getVmList()
    //           //     // this.$message({
    //           //     //   type: 'info',
    //           //     //   message: `action: ${ action }`
    //           //     // });
    //           //   }
    //           // });
    //           // layer.alert('请通知管理员配置UNS连接地址!', {
    //           //     icon: 5
    //           // });
    //         } else {
    //           this.$message({
    //             type: 'error',
    //             message: res.resultDesc
    //           });
    //         }
    //         this.multSelection = [{
    //           disk: 0
    //         }]
    //         this.getVmList()
    //       }).catch(() => {
    //         this.loadingState = false;
    //       })
    //     }).catch(() => {

    //     })

    //   },
    //   restart() { //重启
    //     this.$confirm('确定要重启该桌面?', '重启桌面', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       let params = {};
    //       let checkStatus = this.multSelection[0]
    //       params.vmId = checkStatus.vmId;
    //       params.faIp = checkStatus.faIp;
    //       params.siteId = checkStatus.siteId;
    //       this.text = '正在重启虚机, 请稍后...'
    //       this.loadingState = true;
    //       httpAjax('desktop/reStart', params).then(res => {
    //         this.loadingState = false;
    //         if (res.resultCode == '0') {
    //           this.$message.success('启动需要一定的时间，请耐心等待!')
    //           // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
    //           //   confirmButtonText: '确定',
    //           //   type: 'success',
    //           //   callback: action => {
    //           //     this.multSelection = [{disk:0}]
    //           //     this.getVmList()
    //           //     // this.$message({
    //           //     //   type: 'info',
    //           //     //   message: `action: ${ action }`
    //           //     // });
    //           //   }
    //           // });
    //           // layer.alert('请通知管理员配置UNS连接地址!', {
    //           //     icon: 5
    //           // });
    //         } else {
    //           this.$message({
    //             type: 'error',
    //             message: res.resultDesc
    //           });
    //         }
    //         this.multSelection = [{
    //           disk: 0
    //         }]
    //         this.getVmList()
    //       }).catch(() => {
    //         this.loadingState = false;
    //       })
    //     }).catch(() => {

    //     })

    //   },
    //   detach() { //清退
    //     this.$confirm('确定要清退该桌面?', '清退桌面', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.loadingState = true;
    //       let params = {};
    //       let checkStatus = this.multSelection[0]
    //       params.computerName = checkStatus.computerName;
    //       params.faIp = checkStatus.faIp;
    //       params.vmId = checkStatus.vmId;
    //       params.siteId = checkStatus.siteId;
    //       this.text = '正在执行清退, 请稍后...'
    //       httpAjax('desktop/detach', params).then(res => {
    //         this.loadingState = false;
    //         if (res.resultCode == "0") {
    //           this.$message({
    //             type: 'success',
    //             message: '清退成功!'
    //           });
    //           //   this.$alert('请在我的订单中查看审批结果!', '清退桌面', {
    //           //     confirmButtonText: '确定',
    //           //     type: 'success',
    //           //     callback: action => {
    //           // this.multSelection = [{disk:0}]
    //           // this.getVmList()
    //           //     }
    //           //   });
    //         } else {
    //           this.$message({
    //             type: 'error',
    //             message: res.resultDesc
    //           });
    //           // this.multSelection = [{disk:0}]
    //           // this.$alert('已经提交过，正在审核中!', '清退桌面', {
    //           //   confirmButtonText: '确定',
    //           //   callback: action => {
    //           //   }
    //           // });
    //         }
    //         this.multSelection = [{
    //           disk: 0
    //         }]
    //         this.getVmList()
    //       }).catch(() => {
    //         this.loadingState = false;
    //       })
    //     }).catch(() => { //取消

    //     })
    //   },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
    //   exportData() {
    //     window.open('/api/desktop/cloudExport')
    //   },
      //   loginCloud() {
      //     var params = {
      //       name: sessionStorage.getItem('username'),
      //       initialPassword: sessionStorage.getItem('password'),
      //       tenantDomain: sessionStorage.getItem('domain')
      //     }
      //     httpAjax('user/unsLogin', params).then(res => {
      //       if (res.noLink) {
      //         this.$message.error('请通知管理员配置UNS连接地址!');
      //       } else {
      //         window.open(res.link + "/servlet/TokenLoginServlet?tokenId=" + res.tokenId);
      //       }
      //     })
      //   },
    //   checkDisable(type) {
    //     if (type === 'start') {
    //       return this.multSelection[0].runState === 'stopped'
    //     } else if (type === 'restart' || type === 'stop') {
    //       return this.multSelection[0].runState === 'running'
    //     } else if (type === 'quit') {
    //       return this.multSelection[0].id && this.multSelection[0].runState !== 'deleted'
    //     } else if (type === 'edit') {
    //       return this.multSelection[0].deskType === 'copyClone'
    //     }
    //   },
      // handleSelectionChange(val) {
      //   },
    //   rowClick(row, column, event) {
    //     // console.log(event)
    //     if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
    //       return
    //     }
    //     if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length === 0) {
    //       //   this.$refs.multipleTable.toggleRowSelection(row);
    //       this.multSelection = [...this.multSelection, row];
    //     } else if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length ===
    //       1) {
    //       this.multSelection = this.multSelection.filter(item => item.id !== row.id);
    //     } else {
    //       this.multSelection = [row];
    //     }
    //     // console.log(  this.multSelection)
    //     this.$refs.multipleTable.toggleRowSelection(row);
    //   },
    //   handleSelectionChangeMerge(val) {
    //     this.multSelection = val;
    //   },
      //   rowClick(row, column, event) {
      //     if (this.multSelection.length > 0 && this.multSelection[0].id !== row.id) {
      //       this.$refs.multipleTable.toggleRowSelection(this.multSelection[0]);
      //       this.multSelection = [row];
      //     } else if (this.multSelection.length > 0 && this.multSelection[0].id === row.id) {
      //       this.multSelection = [{
      //         disk: 0
      //       }];
      //     } else {
      //       this.multSelection = [row];
      //     }
      //     this.$refs.multipleTable.toggleRowSelection(row);
      //     console.log(this.multSelection);
      //   },
    //   checkSelect(selection, row) {
    //     //   if(selection.length===1){
    //     //   }
    //     if (selection.length > 1) {
    //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
    //     }
    //     this.multSelection = selection;
    //     // console.log(selection, row)
    //   },
    //   rowClick1(row, column, event) {
    //     if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id !== row.id) {
    //       this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
    //       this.multSelectionTran = [row];
    //     } else if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id === row.id) {
    //       this.multSelectionTran = [];
    //     } else {
    //       this.multSelectionTran = [row];
    //     }
    //     this.$refs.multipleTableTran.toggleRowSelection(row);
    //   },
    //   checkSelect1(selection, row) {
    //     //   if(selection.length===1){
    //     //   }
    //     if (selection.length > 1) {
    //       this.$refs.multipleTableTran.toggleRowSelection(selection[0]);
    //     }
    //     this.multSelectionTran = selection;
    //     // console.log(selection, row)
    //   },

      getVmList(first, page) {
        this.multSelection = []
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
            teacher: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `classroom/classroomList`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data;

          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
          //   this.getStatistics()
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChange(val) {
        this.multSelection = []
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.multSelection = []
        this.currentSize = val;
        this.getVmList()
      },
    //   handleCurrentChange1(val) { //资产转移
    //     this.multSelectionTran = []
    //     this.currentPage5 = val;
    //     this.postpone()
    //   },
    //   handleSizeChange1(val) { //资产转移
    //     this.multSelectionTran = []
    //     this.currentSize1 = val;
    //     this.postpone()
    //   },
    //   getStatistics() {
    //     const url = 'desktop/adminStatistics?online=1'
    //     httpAjax(url).then((res) => {
    //       if (res.cpu) {
    //         this.total = res.merCnt
    //         this.cpu = res.cpu
    //         this.memory = res.memory
    //         this.disk = res.disk
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   },
      // patternState(obj) {
      //   let state = obj.opType
      //   return state == 'set' ? '维护模式' : '工作模式'
      // },
      setScrollBar(dom) {
        // if (this.tableData.length) {
        addScrollBar(dom)
        // }
      },
    }
  }

</script>
<style scoped>
  .bottomWrap {
    position: absolute;
    padding: 0 15px 0px 15px;
    bottom: 0;
    width: calc(100% - 60px);
    height: 40px;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;
  }

  .bgc {
    height: 30px;
    width: 30px;
    margin: 0 auto;
  }

</style>
<style>
  #adminResource .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }

  #adminResource .iconfont {
    font-size: 12px;
    margin-right: 5px;
  }

  #adminResource .el-color-picker__trigger {
    height: 45px;
    width: 195px;
  }

</style>
