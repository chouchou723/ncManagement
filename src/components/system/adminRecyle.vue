<template>
  <div id="adminRecyle" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入使用人" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyTable"
        @keyup.enter.native="clearData" @clear="clearData(2)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择运行状态" clearable v-model="applyState"
        @keyup.enter.native="clearData" @clear="change(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择登录状态" clearable v-model="applyLoginState"
        @keyup.enter.native="clearData" @clear="change(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <!-- <el-button  style="float:right;margin-right:10px;" @click="handleClickRestart(multSelection[0])" type="primary" 
          :loading="btnLoading"  :disabled="multSelection.length==0">恢复桌面</el-button> -->
    </div>
    <div class="table-wrap" id="table-wrap">
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @select="checkSelect" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55" >
        </el-table-column> -->
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="postpone(scope.row,'chooseOld')" type="primary" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">恢复桌面</el-button>
            <!-- <el-button @click="handleClickRestart(scope.row)" type="primary" size="small" :loading="btnLoading&&(btnIndex===scope.row.id)">恢复桌面</el-button> -->
            <el-button @click="auditReject(scope.row)" type="danger" size="small"
              :loading="btnLoading&&(btnIndex===scope.row.id)">彻底删除</el-button>

          </template>
        </el-table-column>
        <el-table-column prop="user" label="使用人" min-width="120">
        </el-table-column>
        <!-- <el-table-column prop="user" label="申请人" width="80" v-if="!tableData.length">
        </el-table-column> -->
        <el-table-column prop="computerName" label="桌面名称" min-width="180">
        </el-table-column>
        <el-table-column prop="merName" label="所属商品" :min-width="150">
            <template slot-scope="scope">
                 {{scope.row.merName||'(FA同步桌面)'}}
          </template>
        </el-table-column>
         <el-table-column prop="operatorAccount" label="所属管理员" width="100">
         </el-table-column>
        <!-- <el-table-column prop="computerName" label="桌面名称" width="80" v-if="!tableData.length">
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
        </el-table-column>
        <el-table-column prop="networkDelays" label="网络延迟" width="100">
        </el-table-column> -->
        <el-table-column prop="ip" label="IP地址" width="120">
        </el-table-column>
        <!-- <el-table-column prop="ip" label="IP地址" width="80" v-if="!tableData.length">
        </el-table-column> -->
        <!-- <el-table-column prop="operatorAccount" label="审批人" width="100">
        </el-table-column> -->
        <el-table-column prop="deskType" label="桌面类型" width="120">
          <template slot-scope="scope">
            <div>
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
        <!-- <el-table-column label="操作" width="100" v-if="tableData.length">
          <template slot-scope="scope">
            <el-button @click="handleClickRestart(scope.row)" type="text" :loading="btnLoading&&(btnIndex===scope.row.id)">{{btnLoading&&(btnIndex===scope.row.id)?'恢复中':'恢复桌面'}}</el-button>
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
    <!-- 资产转移  -->
    <el-dialog title="选择恢复桌面的使用人" :visible.sync="transformForm" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='6%' @close='resetD("transformForm")'>
      <div class="search-wrap">
        <el-input placeholder="请输入使用人名称" v-model="queryUserName" style="width:185px;" clearable
          @clear="queryUserList" />
        <el-button type="ghost" @click="queryUserList"><i class="el-icon-search"></i>查询</el-button>
      </div>
      <div class="table-wrap" id="table-wrapTran">
        <el-table :data="userListData" height="360" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClick1" @select="checkSelect1"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="用户名">
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListData.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="countTran">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="multSelectionTran.length===0"
          @click="handleClickRestart">确
          定</el-button>
        <el-button @click="transformForm = false">取 消</el-button>
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
  import {
    selectRunState,
    selectLoginState
  } from 'api/resources'
  export default {
    data() {
      return {
          backData:'',
        queryUserName: '',
        btnIndex: '',
        btnLoading: false,
        multSelectionTran: [],
        countTran: 0,
        userListData: [],
        transformForm: false,
        // loadingRadio: false,
        no: false,
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
        currentPage5: 1,
        currentSize: 10,
        currentSize1: 10,
        multSelection: [],
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
      queryUserList() {
        this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
        this.currentPage5 = 1;
        this.currentSize1 = 10;
        this.multSelectionTran = [];
        this.postpone();
      },
      auditReject(data) {
        this.btnIndex = data.id;
        this.$confirm('确认是否真的删除该桌面,无法撤销!', '删除', {
          confirmButtonText: '确认',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          //   cancelButtonClass: 'el-button--danger',
          type: 'warning'
        }).then(({
          value
        }) => {
          let params = {};
          params.faIp = data.faIp;
          params.vmId = data.vmId;
          params.siteId = data.siteId;
          params.computerName = data.computerName;
          this.btnLoading = true;
          httpAjax('desktop/deleteInstances', params).then(res => {
              if (res.resultCode == "0") {
            this.getVmList();
            this.$message({
              type: 'success',
              message: '彻底删除成功'
            });
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc
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
        }).catch(() => {});
      },
      handleCurrentChange1(val) { //资产转移
        this.multSelectionTran = []
        this.currentPage5 = val;
        this.postpone()
      },
      handleSizeChange1(val) { //资产转移
        this.multSelectionTran = []
        this.currentSize1 = val;
        this.postpone()
      },
      postpone(data = '', type = '') { //获取转移名单
        if (data) {
          this.queryUserName = data.user;
          this.backData = {
            ...data
          }
        }
        let url =
          `user/adminUserList?${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&name=${this.queryUserName}`
        httpGet(url).then((res) => {
          if (res.data) {
            this.userListData = res.data;
            if (type === 'chooseOld') {
              this.multSelectionTran = res.data;
              this.$nextTick(() => {
                this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
              })
            }
            this.countTran = res.count
            this.transformForm = true
            this.$nextTick(() => {
              addScrollBar('#table-wrapTran', true)
            })
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      resetD(formName) {
        this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
        this.multSelectionTran = []
        this.userListData = [];
        this.currentPage5 = 1;
        this.currentSize1 = 10;
        this.queryUserName = '';
      },
      rowClick1(row, column, event) {
        if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id !== row.id) {
          this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
          this.multSelectionTran = [row];
        } else if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id === row.id) {
          this.multSelectionTran = [];
        } else {
          this.multSelectionTran = [row];
        }
        this.$refs.multipleTableTran.toggleRowSelection(row);
      },
      checkSelect1(selection, row) {
        //   if(selection.length===1){
        //   }
        if (selection.length > 1) {
          this.$refs.multipleTableTran.toggleRowSelection(selection[0]);
        }
        this.multSelectionTran = selection;
        // console.log(selection, row)
      },
      checkSelect(selection, row) {
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.multSelection = selection;
      },
      handleClickRestart() { //重新发起
        // this.$confirm('确定恢复该桌面吗?', '恢复桌面', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        let data = this.backData;
        //   this.btnIndex = data.id
        this.btnLoading = true;
        let params = {}
        params.faIp = data.faIp;
        params.vmId = data.vmId;
        params.siteId = data.siteId;
        // params.user = data.user;
        
        params.user = data.computerName.split('\\')[0]+'\\'+this.multSelectionTran[0].name;
        params.computerName = data.computerName;
        // console.log(params.user)
        httpAjax('merchandise/resumeAttachCompute', params).then(res => {
          if (res.result == "success") {
            this.$message({
              type: 'success',
              message: '恢复成功'
            });
            this.getVmList();
            this.multSelectionTran = []
          } else {
            this.$message({
              type: 'error',
              message: res.desc || '恢复失败!'
            });
          }
          this.transformForm = false;
          this.btnLoading = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '恢复失败!'
          });
          this.btnLoading = false;
          this.transformForm = false;
        })
        // }).catch(() => {

        // })


      },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      // handleSelectionChange(val) {
      //   },
      //   checkSelect(selection, row) {
      //     if (selection.length > 1) {
      //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
      //     }
      //     this.multSelection = selection;
      //   },
      runState(params) {
        let runState = params.row.runState
        if (runState == 'running') {
          return '运行中'
        } else if (runState == 'creating') {
          return '创建中'
        } else if (runState == 'stopped') {
          return '已停止'
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
        const url = `desktop/adminRecycleBinList?${Math.random()}`
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
      //     const url = 'desktop/cloudStatistics?'
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

</style>
