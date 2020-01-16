<template>
  <div id="adminApplied">
    <div class="search-wrap">
      <!-- <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)"></el-input> -->
      <el-date-picker v-model="createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择创建时间" :editable="no"
        clearable @change="clearDataD(2)" :picker-options="pickerOptions1">
      </el-date-picker>
      <!-- <el-select style="width:190px" placeholder="请选择业务类型" clearable v-model="businessType"
        @keyup.enter.native="clearData" @clear="clearData(3)">
        <el-option value="provide" label="桌面申请">桌面申请</el-option>
        <el-option value="detach" label="桌面清退">桌面清退</el-option>
        <el-option value="postpone" label="延期申请">延期申请</el-option>
        <el-option value="modifyVMStandard" label="桌面规格申请">桌面规格申请</el-option>
      </el-select> -->
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
    </div>
    <!-- <div class="button-wrap">
      <el-button size="small" type="primary" @click="exportData">重新发起</el-button>
    </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect" stripe
        ref="multipleTable" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column label="审批" width="200">
          <template slot-scope="scope">
            <el-button @click="auditPass(scope.row)" type="primary" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">同意</el-button>
            <el-button @click="auditReject(scope.row)" type="danger" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="桌面名称">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" > -->
            {{scope.row.computerName||scope.row.name}}
            <!-- </el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="userAccount" label="申请人">
        </el-table-column>
        <!-- <el-table-column prop="businessType" label="业务类型" width="120">
          <template slot-scope="scope">
            <div>
              {{bizTypeTpl(scope)}}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="orderState" label="订单状态" width="120">
          <template slot-scope="scope">
            <div>
              {{orderStateTpl(scope)}}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="description" label="描述" >
        </el-table-column> -->
        <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
        </el-table-column>
        <!-- <el-table-column prop="deadline" label="到期日"  width="110">
            <template slot-scope="scope">
                  <div style="color:#f10000">
                      {{scope.row.deadline}}
                  </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <div>
              {{new Date(scope.row.createTime).toLocaleString()}}
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
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
    <!-- <el-dialog title="订单详情" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='9%' width="60%">
      <div class="dialogContent">
        <div style="flex:0 0 30%;border-right:1px solid gainsboro;margin-right:5%">
          <el-timeline v-if="activities.length!==0">
            <el-timeline-item v-for="(activity, index) in activities" :key="index" color="#409EFF"
              :timestamp="activity.createTime?new Date(activity.createTime).toLocaleString():''">
              {{activity.orderContent||'未知信息'}}
            </el-timeline-item>
          </el-timeline>
          <el-timeline v-if="activities.length===0">
            <el-timeline-item>
              暂无信息
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="dialogRightContent">
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">使用人:</span>{{logContent.userAccount}}</div>
            <div class="dialogDiv"><span class="dialogTitle">创建时间:</span>{{logContent.createTime}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">vmId:</span>{{logContent.vmId}}</div>
            <div class="dialogDiv"><span class="dialogTitle">商品名称:</span>{{logContent.computerName||logContent.name}}
            </div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">桌面类型:</span>{{clouldType(logContent.deskType)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">CPU/内存/磁盘:</span>{{logContent.feature}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">业务类型:</span>{{bizTypeTplD(logContent.businessType)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">到期日:</span>{{logContent.deadline}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">工单状态:</span>{{orderStateTplD(logContent.orderState)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">受理人:</span>{{logContent.dealPerson}}</div>
          </div>
        </div>


      </div>
    </el-dialog> -->
    <!-- 命名规则 -->
    <!-- <el-dialog title="命名规则" :visible.sync="dialogFormVisibleAudit" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='7%' width="40%" @close='resetD("aform")'>
      <el-form :model="aform" :rules="rule2" ref="aform">
        <el-form-item label="命名规则：" :label-width="formLabelWidth" prop="namePolicy">
          <el-select style="width:190px;" placeholder="请选择命名规则" v-model="aform.namePolicy">
            <el-option :value="item.name" :label="item.name" v-for="(item,index) in nameList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`IP地址：`" :label-width="formLabelWidth" prop="IpAddress" v-if="aform.ipDistri==='static'">
          <el-input v-model="aform.IpAddress" placeholder='请输入IP地址' style='width:190px;'></el-input>
          <div>目前网段:{{aform.ipScope}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="auditO('aform')">提 交</el-button>
        <el-button @click="dialogFormVisibleAudit = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- <psloading v-show="loadingState" :text="text"></psloading> -->
  </div>
</template>


<script>
  import {
    httpAjax,
    httpGet,
    computedTableHeight,
    addScrollBar
  } from 'api/common'
  export default {
    data() {
    //   var nan32 = (rule, value, callback) => {
    //     var reg =
    //       /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    //     if (!reg.test(value)) {
    //       callback('请按规范输入 IP 地址, 例如: 192.168.3.5')
    //     } else {
    //       callback()
    //     }
    //   }
      return {
        btnIndex: '',
        btnLoading: false,
        no: false,
        createTime: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        tableData: [],
        count: 0,
        tableHeight: 400,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
        multSelection: [],
        applyUser: '',
        // loadingState: false,
        applyLoginState: 'applied',
        businessType: '',
        // text: '请稍后',
        dialogFormVisible: false,
        taskID: '',
        activities: [],
        logContent: {},
        dialogFormVisibleAudit: false,
        formLabelWidth: '120px',
        nameList: [],
        // aform: {
        //   namePolicy: '',
        //   IpAddress: '',
        //   ipScope: '',
        //   ipDistri: ''

        // },
        // rule2: {
        //   namePolicy: [{
        //     required: true,
        //     message: '请选择命名规则',
        //     // validator: nan16,
        //     trigger: 'change'
        //   }],
        //   IpAddress: [{
        //     required: true,
        //     validator: nan32,
        //     trigger: 'blur'
        //   }]
        // },
        backData: ''
      }
    },
    created() {
      this.getVmList(1)
    },
    // mounted() {
    //   this.$nextTick(() => {
    //     this.tableHeight = computedTableHeight()
    //   })
    // },
    methods: {
      auditPass(data) {
        this.btnIndex = data.id;
        //   this.aform.ipDistri = data.ipDistri;
        //   this.aform.ipScope = data.ipScope;
        this.backData = data;
        this.auditDesktop();
        //   if (data.businessType == "provide") { //桌面申请时
        //     this.getNameList(data.faIp);
        //   } else { //非桌面申请时,比如增加磁盘之类
        //     this.auditDesktop({
        //       id: data.id
        //     });
        //   }
      },
      auditReject(data) {
        this.btnIndex = data.id;
        this.$confirm('确定拒绝该申请', '拒绝申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({
          value
        }) => {
          let params = {};
          params.id = data.id;
          params.orderState = 'reject';
          this.btnLoading = true;
          httpAjax('merchandise/auditDesktop', params).then(res => {
            //   if (res.result == "success") {
            this.getVmList();
            this.multSelection = [];
            this.btnLoading = false;
            this.$message({
              type: 'success',
              message: '审批成功'
            });
            //   } else {
            //     this.$message({
            //       type: 'error',
            //       message: '已经提交过，正在审核中!'
            //     });
            //   }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '审批失败!'
            });
            this.btnLoading = false;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消审批'
          });
        });
      },
      //     resetD(name) {
      //     this.aform = {
      //       namePolicy: '',
      //       IpAddress: '',
      //       ipDistri: '',
      //       ipScope: ''
      //     }
      //     this.$refs[name].resetFields();
      //   },
      //   auditO() {//桌面申请的时候的同意
      //     this.$refs['aform'].validate((valid) => {
      //       let params = {};
      //       params.id = this.backData.id;
      //     //   params.namePolicy = this.aform.namePolicy
      //     //   if (this.backData.ipDistri === 'static') { //静态ip时
      //     //     params.IpAddress = this.aform.IpAddress;
      //     //   }
      //       if (valid) {
      //         this.btnLoading = true;
      //         httpAjax('desktop/auditDesktop', params).then(res => {
      //           if (res.result == "success") {
      //             this.$message({
      //               type: 'success',
      //               message: '操作成功,ita执行中,请稍等!'
      //             });
      //           } else {
      //             this.$message({
      //               type: 'error',
      //               message: res.result
      //             });
      //           }
      //           this.getVmList()
      //           this.dialogFormVisibleAudit = false;
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
      auditDesktop() { //审批同意
        this.btnLoading = true;
        let para = {
          id: this.backData.id,
          orderState:'approved'
        }
        httpAjax('merchandise/auditDesktop', para).then(res => {
          if (res.resultCode == "0") {
            this.$message({
              type: 'success',
              message: '操作成功,ita执行中,请稍等!'
            });
            this.multSelection = [];
            this.getVmList()
          } else {
            this.$message({
              type: 'error',
              message: res.resultDesc
            });
          }
          this.btnLoading = false;
          //   this.getVmList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '发起失败!'
          });
          this.btnLoading = false;

        })
      },
    //   getNameList(faIp) { //获取命名空间
    //     let params = {};
    //     params.faIp = faIp;
    //     this.dialogFormVisibleAudit = true;
    //     httpAjax('desktop/findNamePolicies', params).then(res => {
    //       this.nameList = res;
    //     })
    //   },
    //   auditOrder() { //点击审批
    //     this.$confirm('请确认是否同意该申请?', '审批订单', {
    //       confirmButtonText: '同意',
    //       confirmButtonClass: 'el-button--primary',
    //       cancelButtonText: '拒绝',
    //       cancelButtonClass: 'el-button--danger',
    //       distinguishCancelAndClose: true,
    //       type: 'warning'
    //     }).then(() => {
    //       this.aform.ipDistri = this.multSelection[0].ipDistri;
    //       this.aform.ipScope = this.multSelection[0].ipScope;
    //       if (this.multSelection[0].businessType == "provide") { //桌面申请时
    //         this.getNameList();
    //       } else { //非桌面申请时,比如增加磁盘之类
    //         this.auditDesktop({
    //           id: this.multSelection[0].id
    //         });
    //       }

    //     }).catch((action) => {
    //       if (action === 'cancel') {
    //         this.$prompt('请输入拒绝原因', '拒绝', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           inputPlaceholder: '请输入拒绝原因',
    //           inputPattern: /.+/,
    //           inputErrorMessage: '请输入拒绝原因'
    //         }).then(({
    //           value
    //         }) => {
    //           let params = {};
    //           params.id = this.multSelection[0].id;
    //           params.description = value;
    //           httpAjax('desktop/refuse', params).then(res => {
    //             //   if (res.result == "success") {
    //             this.getVmList();
    //             this.multSelection = [];
    //             this.$message({
    //               type: 'success',
    //               message: '审批成功'
    //             });
    //             //   } else {
    //             //     this.$message({
    //             //       type: 'error',
    //             //       message: '已经提交过，正在审核中!'
    //             //     });
    //             //   }
    //           }).catch(() => {
    //             this.$message({
    //               type: 'error',
    //               message: '审批失败!'
    //             });
    //           })
    //         }).catch(() => {
    //           this.$message({
    //             type: 'info',
    //             message: '取消审批'
    //           });
    //         });

    //       }

    //     });
    //   },
    //   handleClick(data) {
    //     this.taskID = data.id;
    //     this.dialogFormVisible = true;
    //     let params = {
    //       orderId: data.id
    //     }
    //     httpAjax('desktop/findOrderLog', params).then(res => {
    //       // console.log(res)
    //       this.activities = res.res;
    //       this.logContent = res.order
    //     }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '发起失败!'
    //       });
    //     })

    //   },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      clearDataD(num) {
        // if (num === 2 && !this.createTime) {
        this.getVmList('', 1)
        // }
      },
      // handleSelectionChange(val) {
      //   },
    //   checkSelect(selection, row) {
    //     if (selection.length > 1) {
    //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
    //     }
    //     this.multSelection = selection;
    //   },
    //   clouldType(deskType) {
    //     if (deskType == 'copyClone') {
    //       return '完整复制'
    //     } else if (deskType == 'linkedClone') {
    //       return '链接克隆'
    //     } else if (deskType == 'memoryClone') {
    //       return '全内存'
    //     }
    //   },
    //   orderStateTplD(status) {
    //     if (status == 'applied') {
    //       return '待审批';
    //     } else if (status == 'oa_applied') {
    //       return 'OA审批中';
    //     } else if (status == 'oa_approved') {
    //       return 'OA审批通过';
    //     } else if (status == 'reject') {
    //       return '已拒绝';
    //     } else if (status == 'approved') {
    //       return '审批通过';
    //     }
    //   },
    //   bizTypeTplD(taskType) {
    //     if (taskType == 'provide') {
    //       return '桌面申请';
    //     } else if (taskType == 'detach') {
    //       return '桌面清退';
    //     } else if (taskType == 'attachVolume') {
    //       return '修改桌面磁盘';
    //     } else if (taskType == 'start') {
    //       return '启动桌面';
    //     } else if (taskType == 'restart') {
    //       return '重启桌面';
    //     } else if (taskType == 'stop') {
    //       return '停止桌面';
    //     } else if (taskType == 'addUser') {
    //       return '添加用户';
    //     } else if (taskType == 'postpone') {
    //       return '延期申请';
    //     } else if (taskType == 'modifyVMStandard') {
    //       return '桌面规格申请';
    //     } else if (taskType == 'renameDesktop') {
    //       return '修改桌面名称';
    //     }
    //   },
    //   bizTypeTpl(params) {
    //     let taskType = params.row.businessType
    //     if (taskType == 'provide') {
    //       return '桌面申请';
    //     } else if (taskType == 'detach') {
    //       return '桌面清退';
    //     } else if (taskType == 'attachVolume') {
    //       return '修改桌面磁盘';
    //     } else if (taskType == 'start') {
    //       return '启动桌面';
    //     } else if (taskType == 'restart') {
    //       return '重启桌面';
    //     } else if (taskType == 'stop') {
    //       return '停止桌面';
    //     } else if (taskType == 'addUser') {
    //       return '添加用户';
    //     } else if (taskType == 'postpone') {
    //       return '延期申请';
    //     } else if (taskType == 'modifyVMStandard') {
    //       return '桌面规格申请';
    //     } else if (taskType == 'renameDesktop') {
    //       return '修改桌面名称';
    //     }
    //   },
    //   orderStateTpl(params) {
    //     let orderState = params.row.orderState
    //     if (orderState == 'applied') {
    //       return '待审批';
    //     } else if (orderState == 'oa_applied') {
    //       return 'OA审批中';
    //     } else if (orderState == 'oa_approved') {
    //       return 'OA审批通过';
    //     } else if (orderState == 'reject') {
    //       return '已拒绝';
    //     } else if (orderState == 'approved') {
    //       return '审批通过';
    //     }
    //   },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          name: this.applyUser,
          createTimeStr: this.createTime,
          orderState: this.applyLoginState,
          businessType: this.businessType

        }
        const url = `merchandise/adminDesktopList?${Math.random()}`
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
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.currentSize = val;
        this.getVmList()
      },
      //   getStatistics() {
      //     const url = 'desktop/userStatistics?online=1'
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
      //   patternState(obj) {
      //     let state = obj.opType
      //     return state == 'set' ? '维护模式' : '工作模式'
      //   },
      setScrollBar(dom) {
        // if (this.tableData.length) {
        addScrollBar(dom, false)
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
    justify-content: flex-end;
    align-items: center;
    color: #606266;
  }

  .dialogContent {
    display: flex;
    justify-content: flex-start;
  }

  .dialogRightContent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    min-height: 300px;
    align-items: flex-start;
    flex-direction: column;
    flex: 0 0 60%;
  }

  .flexTwo {
    flex: auto;
    width: 100%;
    display: flex;
  }

  .dialogDiv {
    flex: 1;
    font-size: 15px;
  }

  .dialogTitle {
    font-size: 15px;
    font-weight: 600;
    margin-right: 5px;
  }

</style>
