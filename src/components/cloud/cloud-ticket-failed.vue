<template>
  <div id="cloudTicketFailed">
    <div class="search-wrap">
      <el-input placeholder="请输入使用人" style="width:185px;" clearable v-model="orderapplyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
      </el-input>

      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)"></el-input>
      <el-date-picker v-model="createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择创建时间" :editable="no"
        clearable @change="clearDataD(2)" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
        <!-- <el-button icon="el-icon-search" circle @click="searchData"></el-button> -->
          <!-- <el-button  style="float:right;margin-right:10px;" @click="handleClickRestart(multSelection[0])" type="primary" 
          :loading="btnLoading"  :disabled="multSelection.length==0">重新发起</el-button> -->
    </div>
    <!-- <div class="button-wrap">
      <el-button size="small" type="primary" @click="exportData">重新发起</el-button>
    </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect" stripe
        ref="multipleTable" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
           <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="handleClickRestart(scope.row)" type="primary" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">重新发起
            </el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="taskID" label="工单ID" >
        </el-table-column> -->
        <el-table-column prop="merName" label="桌面名称">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{scope.row.computerName||scope.row.merName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="使用人" width="200">
        </el-table-column>
        <el-table-column prop="vmId" label="VmId"  width="100">
        </el-table-column>
        <el-table-column prop="taskType" label="业务类型" width="150">
          <template slot-scope="scope">
            <div>
              {{bizTypeTpl(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" >
        </el-table-column>
        <!-- <el-table-column prop="status" label="工单状态">
          <template slot-scope="scope">
            <div :style="scope.row.status=='FAILED'?'color:#f10000':scope.row.status=='SUCCESS'?'color:#42b983':scope.row.status=='RUNNING'?'':'color:#d80f17'">
              {{orderStateTpl(scope)}}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <div>
              {{scope.row.createTimeStr}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClickRestart(scope.row)" type="text" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">{{btnLoading&&(btnIndex===scope.row.id)?'发起中':'重新发起'}}
            </el-button>
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
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='9%' width="60%">
      <div class="dialogContent">
        <div style="flex:0 0 30%;border-right:1px solid gainsboro;margin-right:5%">
          <el-timeline v-if="activities.length!==0">
            <el-timeline-item v-for="(activity, index) in activities" :key="index"
              :color="activity.status=='FAILED'?'red' : (activity.status=='SUCCESS'||activity.status=='ok')? '#0bbd87' : activity.status=='RUNNING'? '#409EFF' : '#0bbd87'"
              :timestamp="activity.endTime?new Date(activity.endTime).toLocaleString():''">
              {{activity.result||'未知信息'}}
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
            <div class="dialogDiv"><span class="dialogTitle">使用人:</span>{{logContent.user}}</div>
            <div class="dialogDiv"><span class="dialogTitle">创建时间:</span>{{logContent.createTimeStr}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">vmId:</span>{{logContent.vmId}}</div>
            <div class="dialogDiv"><span class="dialogTitle">商品名称:</span>{{logContent.computerName||logContent.merName}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">桌面类型:</span>{{clouldType(logContent.deskType)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">CPU/内存/磁盘:</span>{{logContent.feature}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">任务类型:</span>{{bizTypeTplD(logContent.taskType)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">到期日:</span>{{logContent.deadline}}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">工单状态:</span>{{orderStateTplD(logContent.status)}}</div>
            <div class="dialogDiv"><span class="dialogTitle">受理人:</span>{{logContent.dealPerson}}</div>
          </div>
        </div>


      </div>
    </el-dialog>
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
      return {
          btnIndex:'',
          btnLoading:false,
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
        orderapplyUser: '',
        // loadingState: false,
        applyLoginState: '',
        // text: '请稍后',
        dialogFormVisible: false,
        taskID: '',
        activities: [],
        logContent: {}
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
      handleClick(data) { //打开详情
        this.taskID = data.id;
        this.dialogFormVisible = true;
        let params = {
          taskID: data.id
        }
        httpAjax('desktop/findTaskLog', params).then(res => {
          // console.log(res)
          this.activities = res.res;
          this.logContent = res.task
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '获取失败!'
          });
        })

      },
      handleDelete(data) { //删除工单
        this.$confirm('确定删除该失败工单吗?', '删除工单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoading = true;
          let params = {
            id: data.id
          }
          httpAjax('desktop/deleteTask', params).then(res => {
            if (res.result == "success") {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getVmList();
              this.multSelection = [];
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnLoading = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnLoading = false;
          })
        }).catch(() => {

        })


      },
      handleClickRestart(data) { //重新发起
        this.$confirm('确定重新发起请求吗?', '重新发起', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoading = true;
          let params = {
            orderId: data.orderId,
            id: data.id
          }
          httpAjax('desktop/reapply', params).then(res => {
            if (res.result == "success") {
              this.$message({
                type: 'success',
                message: '发起成功'
              });
              this.getVmList();
              this.multSelection = [];
            } else {
              this.$message({
                type: 'error',
                message: '发起失败!'
              });
            }
            this.btnLoading = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '发起失败!'
            });
            this.btnLoading = false;
          })
        }).catch(() => {

        })


      },
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
    checkSelect(selection, row) {
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.multSelection = selection;
      },
      clouldType(deskType) {
        if (deskType == 'copyClone') {
          return '完整复制'
        } else if (deskType == 'linkedClone') {
          return '链接克隆'
        } else if (deskType == 'memoryClone') {
          return '全内存'
        }
      },
      orderStateTplD(status) {
        if (status == 'SUCCESS') {
          return '成功';
        } else if (status == 'FAILED') {
          return '失败';
        } else if (status == 'RUNNING') {
          return 'ita执行中';
        } else if (status == 'deleted') {
          return '已删除';
        }else{
            return status
        }
      },
      bizTypeTplD(taskType) {
        if (taskType == 'provide') {
          return '桌面申请';
        } else if (taskType == 'detach') {
          return '桌面清退';
        } else if (taskType == 'attachVolume') {
          return '修改桌面磁盘';
        } else if (taskType == 'start') {
          return '启动桌面';
        } else if (taskType == 'restart') {
          return '重启桌面';
        } else if (taskType == 'stop') {
          return '停止桌面';
        } else if (taskType == 'addUser') {
          return '添加用户';
        } else if (taskType == 'postpone') {
          return '延期申请';
        } else if (taskType == 'modifyVMStandard') {
          return '桌面规格申请';
        }  else if (taskType == 'reapply') {
          return '重新发起';
        }else if (taskType == 'renameDesktop') {
          return '修改桌面名称';
        }else if (taskType == 'resume') {
          return '恢复桌面';
        }else if (taskType == 'deleting') {
          return '彻底删除桌面';
        }else if (taskType == 'migration') {
          return '资产转移';
        }else if (taskType == 'delUser') {
          return '移除用户权限';
        }else {
          return taskType;
        }
      },
      bizTypeTpl(params) {
        let taskType = params.row.taskType
        if (taskType == 'provide') {
          return '桌面申请';
        } else if (taskType == 'detach') {
          return '桌面清退';
        } else if (taskType == 'attachVolume') {
          return '修改桌面磁盘';
        } else if (taskType == 'start') {
          return '启动桌面';
        } else if (taskType == 'restart') {
          return '重启桌面';
        } else if (taskType == 'stop') {
          return '停止桌面';
        } else if (taskType == 'addUser') {
          return '添加用户';
        } else if (taskType == 'postpone') {
          return '延期申请';
        } else if (taskType == 'modifyVMStandard') {
          return '桌面规格申请';
        }  else if (taskType == 'reapply') {
          return '重新发起';
        }else if (taskType == 'renameDesktop') {
          return '修改桌面名称';
        }else if (taskType == 'resume') {
          return '恢复桌面';
        }else if (taskType == 'deleting') {
          return '彻底删除桌面';
        }else if (taskType == 'migration') {
          return '资产转移';
        }else if (taskType == 'delUser') {
          return '移除用户权限';
        }else {
          return taskType;
        }
      },
      orderStateTpl(params) {
        let status = params.row.status
        if (status == 'SUCCESS') {
          return '成功';
        } else if (status == 'FAILED') {
          return '失败';
        } else if (status == 'RUNNING') {
          return 'ita执行中';
        } else if (status == 'deleted') {
          return '已删除';
        }else{
            return status
        }
      },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          merName: this.applyUser,
          user: this.orderapplyUser,
          createTimeStr: this.createTime,
          status: 'failedList'

        }
        const url = `desktop/cloudTicketList?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data;
          this.vmTableLoadingState = false;
          this.count = res.count;
          //   this.getStatistics()
        }).then(()=>{
            this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
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
