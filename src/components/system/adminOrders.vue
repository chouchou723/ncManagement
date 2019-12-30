<template>
  <div id="adminOrders">
    <div class="search-wrap">
      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)"></el-input>
      <el-date-picker v-model="createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择创建时间" :editable="no"
        clearable @change="clearDataD(2)" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-select style="width:190px" placeholder="请选择业务类型" clearable v-model="businessType"  @keyup.enter.native="clearData" @change="clearData(3)">
        <el-option value="provide" label="桌面申请">桌面申请</el-option>
        <el-option value="detach" label="桌面清退">桌面清退</el-option>
        <!-- <el-option value="attachVolume" label="修改桌面磁盘">修改桌面磁盘</el-option> -->
        <el-option value="postpone" label="延期申请">延期申请</el-option>
        <el-option value="modifyVMStandard" label="桌面规格申请">桌面规格申请</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择订单状态" clearable v-model="applyLoginState"  @keyup.enter.native="clearData" @change="clearData(4)">
        <el-option value="applied" label="待审批">待审批</el-option>
        <el-option value="approved" label="审批通过">审批通过</el-option>
         <el-option value="oa_applied" label="OA审批中">OA审批中</el-option>
        <el-option value="oa_approved" label="审批通过">OA审批通过</el-option>
        <el-option value="reject" label="已拒绝">已拒绝</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
    </div>
    <!-- <div class="button-wrap">
      <el-button size="small" type="primary" @click="exportData">重新发起</el-button>
    </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="name" label="桌面名称" >
              <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" >{{scope.row.computerName||scope.row.name}}</el-button>
          </template>
        </el-table-column>
         <el-table-column prop="userAccount" label="使用人">
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" width="120">
          <template slot-scope="scope">
            <div>
              {{bizTypeTpl(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态">
          <template slot-scope="scope">
            <div :style="scope.row.orderState=='reject'?'color:#f10000':scope.row.orderState.indexOf('approved')>-1?'color:#42b983':''">
              {{orderStateTpl(scope)}}
            </div>
            <!-- <div>
              {{orderStateTpl(scope)}}
            </div> -->
          </template>
        </el-table-column>
         <el-table-column prop="dealPerson" label="受理人">
        </el-table-column>
        <el-table-column prop="description" label="描述" >
        </el-table-column>
        <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
        </el-table-column>
        <el-table-column prop="deadline" label="到期日" width="110">
          <template slot-scope="scope">
            <div style="color:#f10000">
              {{scope.row.deadline}}
            </div>
          </template>
        </el-table-column>
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
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='9%' width="60%">
      <div class="dialogContent">
        <div style="flex:0 0 30%;border-right:1px solid gainsboro;margin-right:5%">
          <el-timeline v-if="activities.length!==0">
            <el-timeline-item v-for="(activity, index) in activities" :key="index" color="#409EFF"
              :timestamp="activity.createTime?new Date(activity.createTime).toLocaleString():''">
              {{activity.orderContent||'未知信息'}}
            </el-timeline-item>
          </el-timeline>
             <el-timeline  v-if="activities.length===0">
            <el-timeline-item >
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
            <div class="dialogDiv"><span class="dialogTitle">商品名称:</span>{{logContent.computerName||logContent.name}}</div>
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
        applyLoginState: '',
        businessType: '',
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
      handleClick(data) {
        this.taskID = data.id;
        this.dialogFormVisible = true;
        let params = {
          orderId: data.id
        }
        httpAjax('desktop/findOrderLog', params).then(res => {
          // console.log(res)
          this.activities = res.res;
          this.logContent = res.order
          //   if (res.result == "success") {
          // this.getVmList();
          // this.$message({
          //   type: 'success',
          //   message: '发起成功'
          // });
          //   } else {
          //     this.$message({
          //       type: 'error',
          //       message: '已经提交过，正在审核中!'
          //     });
          //   }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '发起失败!'
          });
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
      // handleSelectionChange(val) {
      //   },
      //   checkSelect(selection, row) {
      //     this.tableChecked = [row]
      //     if (selection.length > 1) {
      //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
      //     }
      //     // console.log(selection, row)
      //   },
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
        if (status == 'applied') {
          return '待审批';
        } else if (status == 'oa_applied') {
          return 'OA审批中';
        } else if (status == 'oa_approved') {
          return 'OA审批通过';
        } else if (status == 'reject') {
          return '已拒绝';
        } else if (status == 'approved') {
          return '审批通过';
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
        } else if (taskType == 'renameDesktop') {
          return '修改桌面名称';
        }
      },
      bizTypeTpl(params) {
        let taskType = params.row.businessType
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
        } else if (taskType == 'renameDesktop') {
          return '修改桌面名称';
        }
      },
      orderStateTpl(params) {
        let orderState = params.row.orderState
        if (orderState == 'applied') {
          return '待审批';
        } else if (orderState == 'oa_applied') {
          return 'OA审批中';
        } else if (orderState == 'oa_approved') {
          return 'OA审批通过';
        } else if (orderState == 'reject') {
          return '已拒绝';
        } else if (orderState == 'approved') {
          return '审批通过';
        }
      },
      getVmList(first,page) {
          page?this.currentPage4 = page:'';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          name: this.applyUser,
          createTimeStr: this.createTime,
          orderState: this.applyLoginState,
          businessType: this.businessType

        }
        const url = `desktop/adminDesktopList?${Math.random()}`
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
          addScrollBar(dom,false)
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
