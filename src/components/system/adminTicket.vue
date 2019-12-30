<template>
  <div id="adminTicket">
    <div class="search-wrap">
      <el-input placeholder="请输入使用人" style="width:185px;" clearable v-model="orderapplyUser"  @keyup.enter.native="clearData" @clear="clearData(1)"></el-input>

      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)"></el-input>
      <el-date-picker v-model="createTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择创建时间" :editable="no"
        clearable @change="clearDataD(2)" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-select style="width:190px" placeholder="请选择业务类型" clearable v-model="businessType"  @keyup.enter.native="clearData" @change="clearData(3)">
        <el-option value="provide" label="桌面申请">桌面申请</el-option>
        <el-option value="detach" label="桌面清退">桌面清退</el-option>
        <!-- <el-option value="postpone" label="延期申请">延期申请</el-option> -->
        <el-option value="modifyVMStandard" label="桌面规格申请">桌面规格申请</el-option>
        <!-- <el-option value="reapply" label="重新发起">重新发起</el-option> -->
        <el-option value="resume" label="恢复桌面">恢复桌面</el-option>
        <el-option value="deleting" label="彻底删除桌面">彻底删除桌面</el-option>
        <el-option value="migration" label="资产转移">资产转移</el-option>
        <!-- <el-option value="delUser" label="移除用户权限">移除用户权限</el-option> -->
        <el-option value="start" label="启动桌面">启动桌面</el-option>
        <el-option value="stop" label="停止桌面">停止桌面</el-option>
        <el-option value="restart" label="重启桌面">重启桌面</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择工单状态" clearable v-model="applyLoginState"  @keyup.enter.native="clearData" @change="clearData(4)">
        <el-option value="SUCCESS" label="成功">成功</el-option>
        <el-option value="FAILED" label="失败">失败</el-option>
        <el-option value="RUNNING" label="ita执行中">ita执行中</el-option>
        <el-option value="deleted" label="已删除">已删除</el-option>
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
        <!-- <el-table-column prop="taskID" label="工单ID" >
             <template slot-scope="scope">
            <div>
                {{scope.row.taskID||'无'}}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="merName" label="桌面名称">
            <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" >{{scope.row.computerName||scope.row.merName}}</el-button>
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
        <el-table-column prop="status" label="工单状态" width="150">
          <template slot-scope="scope">
            <div :style="scope.row.status=='FAILED'?'color:#f10000':scope.row.status=='SUCCESS'?'color:#42b983':scope.row.status=='RUNNING'?'':scope.row.status=='deleted'?'color:#d80f17':''">
              {{orderStateTpl(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" >
        </el-table-column>
         <!-- <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
        </el-table-column> -->
         <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <div  style="padding:9px 0">
              {{scope.row.createTimeStr}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="dealPerson" label="受理人">
        </el-table-column> -->
       
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
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]" :page-size="currentSize" layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='9%' width="60%">
      <div class="dialogContent">
        <div style="flex:0 0 30%;border-right:1px solid gainsboro;margin-right:5%">
          <el-timeline  v-if="activities.length!==0">
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.endTime?new Date(activity.endTime).toLocaleString():''"
              :color='activity.status=="FAILED"?"red": (activity.status=="SUCCESS"||activity.status=="ok")?"#0bbd87": activity.status=="RUNNING"?"#409EFF": "#0bbd87"'>
              {{activity.result||'未知信息'}}
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
          businessType:'',
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
        orderapplyUser:'',
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
      handleClick(data) {
        this.taskID = data.id;
        this.dialogFormVisible = true;
        let params = {
          taskID: data.id
        }
        httpAjax('desktop/findTaskLog', params).then(res => {
          // console.log(res)
          this.activities = res.res;
          this.logContent = res.task
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
        this.getVmList('',1)
      },
      clearData(num) {
        this.getVmList('',1)
      },
      clearDataD(num) {
        // if (num === 2 && !this.createTime) {
          this.getVmList('',1)
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
        } else if (taskType == 'reapply') {
          return '重新发起';
        } else if (taskType == 'renameDesktop') {
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
        } else if (taskType == 'renameDesktop') {
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
      getVmList(first,page) {
          page?this.currentPage4 = page:'';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          merName: this.applyUser,
          user: this.orderapplyUser,
          createTimeStr: this.createTime,
          status: this.applyLoginState,
            taskType:this.businessType
        }
        const url = `desktop/adminTicketList?${Math.random()}`
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
