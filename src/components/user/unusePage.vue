<template>
  <div id="unuserPage">
    <div class="search-wrap">
      <el-date-picker v-model="opStartTime" value-format="yyyy-MM-dd"  type="daterange"
      range-separator="至"
      start-placeholder="开始日期" :clearable="false"
      end-placeholder="结束日期" :editable="no" @change="searchData" :picker-options="pickerOptions1">
      </el-date-picker>
       <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader>
        <!-- <div v-if="opStartTime.length===0" style="float:right;margin-right:20px;color:#606266;line-height:40px;font-size:20px">
            最近统计日期:{{new Date().toLocaleDateString()}}
        </div> -->
      <!-- <el-select style="width:190px;" placeholder="请选择用户" clearable v-model="applyState" @change="getVmList('', 1)"
        v-if="localRole==='admin'">
        <el-option v-for="(item,index) in userList" :key="index" :value="item.name" :label="item.name">
          {{item.name}}</el-option>
      </el-select> -->
      <!-- <el-button icon="el-icon-search" circle @click="searchData"></el-button> -->
    </div>
    <div class="table-wrap">
      <el-table id="table-wrap" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
        <el-table-column prop="computerName" label="桌面名称">
              <template slot-scope="scope">
               <div style="padding:9px 0">
              {{scope.row.computerName}}
            </div>
              </template>
        </el-table-column>
        <el-table-column prop="user" label="使用人">
        </el-table-column>
        <el-table-column prop="instanceId" label="instanceId">
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="统计时间">
        </el-table-column> -->
        <!-- <el-table-column prop="detail" label="明细">
        </el-table-column>
        <el-table-column prop="type" label="类型">
        </el-table-column> -->
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <!-- <div class="total-wrap" v-show="tableData.length">
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
          pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        applyOu:[],
        ouSelectList:[],
        opStartTime: [new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+'01',new Date().toLocaleDateString().replace(/\//g,'-')],
        no: false,
        tableData: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        cpu: 0,
        memory: 0,
        disk: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
        multSelection: [],
        applyUser: '',
        applyTable: '',
        applyState: '', //管理员使用
        applyLoginState: '',
        userList: []
      }
    },
    created() {
      this.getVmList(1);
      if (this.localRole === 'admin') {
        this.getUserList();
      }
       this.getOu()
    },
    mounted() {
      //   this.$nextTick(() => {
      //     this.tableHeight = computedTableHeight()
      //   })
      //         this.$nextTick(() => {
      //              addScrollBar('#table-wrap')
      //   })
    },
    computed: {
      localRole() {
        return sessionStorage.getItem('role')
      },
    },
    methods: {
         clearC(v) {
            // console.log(v, this.applyOu)
        // if (v.length === 0) {
          this.getVmList('', 1)
        // }
      },
      visibleChange(v) {
        // if (this.applyOu.length===0) {
        //     // console.log(v, this.applyOu)
        //   return
        // }
        // if (v === false) { //才调接口
        //   this.getVmList('', 1)
        // }
      },
       getOu() {
        httpGet('tenant/findDivisions').then((res) => {
          if (res) {
            this.ouSelectList = res;
            //   console.log(this.ouSelectList)
            // this.form.ou = this.ouSelectList[0].value;
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getUserList() {
        const url = `user/adminUserList?page=1&limit=100000`
        httpGet(url).then((res) => {
          this.userList = res.data;
        }).catch((error) => {
          console.log(error)
        })
      },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      getVmList(first, page) {
          this.vmTableLoadingState = true;
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          // user: this.applyUser,
          startDate: this.opStartTime?this.opStartTime[0]:'',
          endDate: this.opStartTime?this.opStartTime[1]:'',
           ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''

        //   userId: this.applyState,
        }
        const url = `desktop/findUnUsedVminfo`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data;
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            addScrollBar('#table-wrap')
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
      // getStatistics() {
      //     const url = 'desktop/userStatistics?online=1'
      //     httpAjax(url).then((res) => {
      //         if (res.cpu) {
      //             this.total = res.merCnt
      //             this.cpu = res.cpu
      //             this.memory = res.memory
      //             this.disk = res.disk
      //         }
      //     }).catch((err) => {
      //         console.log(err)
      //     })
      // },
      // patternState(obj) {
      //     let state = obj.opType
      //     return state == 'set' ? '维护模式' : '工作模式'
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
    justify-content: flex-end;
    align-items: center;
    color: #606266;
  }

</style>
