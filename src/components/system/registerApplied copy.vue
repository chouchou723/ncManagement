<template>
  <div id="adminApplied">
    <div class="search-wrap">
      <el-input placeholder="请输入用户名" style="width:185px;"  v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
        <el-date-picker v-model="createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择申请时间" editable
        clearable @change="clearData(1)" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <!-- <el-button type="primary" @click="auditOrder" style="float:right;margin-right:10px;"
        :disabled="multSelection.length==0">审批</el-button> -->
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
            <el-button @click="auditPass(scope.row)" type="primary" size="small"  :loading="btnLoading&&(btnIndex===scope.row.id)">同意</el-button>
            <el-button @click="auditReject(scope.row)" type="danger" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名">
        </el-table-column>
        <!-- <el-table-column prop="type" label="用户类型">
          <template slot-scope="scope">
            <div>
              {{scope.row.type==='intern'?'实习':scope.row.type==='outsource'?'外包':'正式'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="school" label="" width="150">
          <template slot-scope="scope">
            <div style="text-align:left;">
              {{scope.row.school?'学校:'+scope.row.school:scope.row.company?'公司:'+scope.row.company:''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="telephoneNumber" label="手机号码" width="150">
        </el-table-column>
        <el-table-column prop="mail" label="邮箱" width="250">
        </el-table-column> -->
        <el-table-column prop="createTimeStr" label="申请时间" min-width="200">
          <!-- <template slot-scope="scope">
            <div>
              {{new Date(scope.row.createTime).toLocaleString()}}
            </div>
          </template> -->
        </el-table-column>
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
    <!-- 选择角色 -->
    <el-dialog title="选择角色" :visible.sync="dialogFormVisibleOu" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='12%' width="40%" @close='resetD("aform")'>
      <el-form :model="oform" ref="oform">
        <el-form-item label="角色：" :label-width="formLabelWidth" prop="role">
          <el-select style="width:220px" placeholder="请选择角色" v-model="oform.role">
            <el-option v-for="(item,index) in ouSelectList" :key="index" :value="item.value" :label="item.label">
              {{item.label}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('oform')">确 定</el-button>
        <el-button @click="dialogFormVisibleOu = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户类型 -->
    <!-- <el-dialog title="用户类型" :visible.sync="dialogFormVisible" :close-on-click-modal="no" top='15%' width="30%"
      @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="用户类型：" :label-width="formLabelWidth" prop="cpu">
          <el-radio-group v-model="aform.radio">
            <el-radio label="3">永久用户</el-radio>
            <el-radio label="6">临时用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="aform.radio==6" label="临时用户有效天数：" :label-width="formLabelWidth" prop="day">
          <el-input-number v-model="aform.day" controls-position="right" :min="1" :max="32"
            :style='{width:inputLabelWidth}'>
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
        backData: '',
        ouSelectList: [{label:'学员',value:'user'},{label:'教员',value:'tenant'},],
        btnIndex: '',
        btnLoading: false,
        dialogFormVisibleOu: false,
        no: false,
        createTime: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        oform: {
          role: 'user'
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
        formLabelWidth: '150px',
        nameList: [],
        aform: {
          radio: '3',
          day: '1'
        }

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
    //   getouSelectList(type) { //选择ou
    //     let url =
    //       `merchandise/describeOuNameInfo`
    //     httpAjax(url, {
    //     //   faIp: this.backData.faIp || '172.16.6.5' //this.backData.faIp,
    //     }).then((res) => {
    //       if (res) {
    //         this.ouSelectList = res.map(item => {
    //           return {
    //             value: item.id + "=" + item.ouName,
    //             label: item.ouName
    //           }
    //         })
    //         //   console.log(this.ouSelectList)
    //         this.oform.ou = this.ouSelectList[0].value;
    //       } else {
    //         this.$message.error('通信错误')
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   },
      addAccount() {
        // if (!this.oform.ou) {
        //   this.$message.error('请选择部门OU');
        //   return
        // }
        this.btnLoading = true;
        let para = {
          id: this.backData.id,
          status: 'pass',
          role:this.oform.role
        //   ou: this.oform.ou
        }
        httpAjax('user/approve', para).then(res => {
          if (res.resultCode == "0") {
            this.$message({
              type: 'success',
              message: '审批成功!'
            });
            this.multSelection = [];
            this.getVmList();
          } else {
            this.$message({
              type: 'error',
              message: res.resultDesc
            });
          }
          this.btnLoading = false;
          this.dialogFormVisibleOu = false;
          //   this.getVmList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '审批失败!'
          });
          this.btnLoading = false;
        })
      },
     auditReject(data) {
        this.btnIndex = data.id
        this.auditDesktop({
          id: data.id,
          status: 'reject'
        });
      },
      auditDesktop(para) { //审批拒绝
        this.btnLoading = true;
        httpAjax('user/approve', para).then(res => {
          if (res.resultCode == "0") {
            this.$message({
              type: 'success',
              message: '审批成功!'
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
      auditPass(data) {//审批同意
        this.btnIndex = data.id;
        this.btnLoading = true;
        this.backData = data;
        // this.getouSelectList();
        this.dialogFormVisibleOu = true;
      },
        // this.auditDesktop({
        //   id: data.id,
        //   status: 'pass'
        // });
    //      let para = {
    //       id: data.id,
    //       status: 'pass',
    //     //   ou: this.oform.ou
    //     }
    //     httpAjax('user/approve', para).then(res => {
    //       if (res.resultCode == "0") {
    //         this.$message({
    //           type: 'success',
    //           message: '审批成功!'
    //         });
    //         this.multSelection = [];
    //         this.getVmList();
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: res.resultDesc
    //         });
    //       }
    //       this.btnLoading = false;
    //     //   this.dialogFormVisibleOu = false;
    //       //   this.getVmList()
    //     }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '审批失败!'
    //       });
    //       this.btnLoading = false;
    //     })
    //   },
     
    //   auditOrder() { //点击审批
    //     this.$confirm('请确认是否同意该申请?', '审批用户', {
    //       confirmButtonText: '同意',
    //       confirmButtonClass: 'el-button--primary',
    //       cancelButtonText: '拒绝',
    //       cancelButtonClass: 'el-button--danger',
    //       distinguishCancelAndClose: true,
    //       type: 'warning'
    //     }).then(() => { //非桌面申请时,比如增加磁盘之类
    //       this.auditDesktop({
    //         id: this.multSelection[0].id,
    //         status: 'pass'
    //       });
    //       //   this.dialogFormVisible = true;
    //     }).catch((action) => {
    //       if (action === 'cancel') {
    //         this.auditDesktop({
    //           id: this.multSelection[0].id,
    //           status: 'reject'
    //         });

    //       }

    //     });
    //   },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      //   clearDataD(num) {
      //     if (num === 2 && !this.createTime) {
      //       this.getVmList('', 1)
      //     }
      //   },
      // handleSelectionChange(val) {
      //   },
      checkSelect(selection, row) {
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.multSelection = selection;
      },

      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          userName: this.applyUser,
          createTimeStr: this.createTime,
        //   orderState: this.applyLoginState,
        //   businessType: this.businessType

        }
        const url = `user/listNewUser?${Math.random()}`
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
      padding: 0 15px 0px 15px;
    /* position: absolute;
    bottom: 0;
    width: calc(100% - 60px); */
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
