<template>
  <div id="cloudResource" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入使用人" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
      </el-input>
      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyTable"  @keyup.enter.native="clearData" @clear="clearData(2)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择运行状态" clearable v-model="applyState"  @keyup.enter.native="clearData" @change="clearData(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择登录状态" clearable v-model="applyLoginState"  @keyup.enter.native="clearData" @change="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
    </div>
    <div class="table-wrap" id="table-wrap">
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @select="checkSelect" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="user" label="使用人"  min-width="120">
        </el-table-column>
        <el-table-column prop="computerName" label="桌面名称"  :min-width="150">
        </el-table-column>
         <el-table-column prop="merName" label="所属商品" :min-width="150">
             <template slot-scope="scope">
                 <div style="padding:9px 0">
                 {{scope.row.merName||'(FA同步桌面)'}}
                 </div>
          </template>
        </el-table-column>
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
        </el-table-column>
        <el-table-column prop="networkDelays" label="网络延迟" width="100">
        </el-table-column> -->
        <el-table-column prop="ip" label="IP地址" width="120">
        </el-table-column>
        <!-- <el-table-column prop="operatorAccount" label="审批人" width="100">
        </el-table-column> -->
        <el-table-column prop="deskType" label="桌面类型" width="120">
          <template slot-scope="scope">
            <div >
              {{clouldType(scope)||'未知'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
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
            <div :style="scope.row.transferUser?'color:#f10000':''">
              {{branchState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opType" label="模式" width="120">
          <template slot-scope="scope">
            <div>
              {{opTypeState(scope)}}
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
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <div class="total-wrap">
        <label>总数：</label><span class="ps-blue ps-count">{{total}}</span>
        <label>CPU/内存/磁盘：</label><span class="ps-yellow ps-count">{{cpu}}个/{{memory}}G/{{disk}}G</span>
      </div>
      <div class="page-wrap">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>

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
  import {
    selectRunState,
    selectLoginState
  } from 'api/resources'
  export default {
    data() {
      return {
        // btnLoading: false,
        // userListData: [],
        // transformForm: false,
        // loadingRadio: false,
        // no: false,
        tableData: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        cpu: 0,
        memory: 0,
        disk: 0,
        vmTableLoadingState: true,
        selectRunState,
        selectLoginState,
        currentPage4: 1,
        currentSize: 10,
        // multSelection: [],
        applyUser: '',
        applyTable: '',
        applyState: '',
        applyLoginState: '',
        loadingState: false,
        text: '请稍后',
      }
    },
    created() {
      this.getVmList(1)
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    methods: {
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      // handleSelectionChange(val) {
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
      runState(params) {
        let runState = params.row.runState
        if (runState == 'running') {
          return '运行中'
        } else if (runState == 'creating') {
          return '创建中'
        } else if (runState == 'stopped') {
          return '已停止'
        }else if (runState == 'processing') {
          return '处理中'
        } else if (runState == 'starting') {
          return '启动中'
        } else if (runState == 'stopping') {
          return '停止中'
        } else if (runState == 'fault-resuming') {
          return '故障修复中'
        } else if (runState == 'DeletedFailure') {
          return '删除失败'
        } else if (runState == 'Deleting') {
          return '已删除'
        } else {
          return runState
        }
      },
      loginState(params) {
        let state = params.row.loginState
        if (state == '23') {
          return '断开连接'
        } else if (state == '25') {
          return '使用中'
        } else if (state == '0') {
          return '就绪'
        } else if (state == '-3') {
          return '未注册'
        } else {
          return '未知'
        }
      },
      opTypeState(params) {
        let opType = params.row.opType
        if (opType == 'set') {
          return '维护模式';
        } else {
          return '工作模式';
        }
      },
      branchState(params) {
        let state = params.row.attachState
        if(params.row.transferUser){
            return '已清退'
        }else if (state == 'ATTACHED') {
          return '已分配'
        } else if (state == 'ATTACHING') {return '分配中'}else if (state == 'UNATTACH') {
          return '未分配'
        } else if (state == 'DEATTACHED') {
          return '已解分配'
        } else {
          return state
        }
      },
      clouldType(params) {
        let deskType = params.row.deskType
        if (deskType == 'copyClone') {
          return '完整复制'
        } else if (deskType == 'linkedClone') {
          return '链接克隆'
        } else if (deskType == 'memoryClone') {
          return '全内存'
        }
      },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          user: this.applyUser,
          computerName: this.applyTable,
          runState: this.applyState,
          loginState: this.applyLoginState
        }
        const url = `desktop/cloudResMonitor?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data;
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
          this.getStatistics()
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
      getStatistics() {
        const url = 'desktop/cloudStatistics?'
        httpAjax(url).then((res) => {
          if (res.cpu) {
            this.total = res.merCnt
            this.cpu = res.cpu
            this.memory = res.memory
            this.disk = res.disk
          }
        }).catch((err) => {
          console.log(err)
        })
      },
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
    justify-content: space-between;
    align-items: center;
    color: #606266;
  }

</style>
