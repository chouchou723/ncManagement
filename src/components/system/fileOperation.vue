<template>
  <div id="fileOperation">
    <div class="search-wrap">
      <el-date-picker v-model="opStartTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择操作时间" :editable="no"
        clearable @change="searchData" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-select style="width:190px;" placeholder="请选择操作类型" filterable clearable v-model="applyType"
        @change="getVmList('', 1)">
        <el-option v-for="(item,index) in typeList" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <!-- <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader> -->
      <el-select style="width:190px;" placeholder="请选择操作人" filterable clearable v-model="applyState"
        @change="getVmList('', 1)" >
        <el-option v-for="(item,index) in userList" :key="index" :value="item.name" :label="item.name">
          {{item.name}}</el-option>
      </el-select>


      <!-- <el-button icon="el-icon-search" circle @click="searchData"></el-button> -->
    </div>
    <div class="table-wrap">
      <el-table id="table-wrap" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
        <el-table-column prop="user" label="操作人">
          <template slot-scope="scope">
            <div style="padding:9px 0">
              {{(scope.row.operator.indexOf('admin')>-1||scope.row.operator.indexOf('Format')>-1||scope.row.operator.indexOf('Quota')>-1)?'admin':scope.row.user}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作类型">
          <template slot-scope="scope">
            {{getOperator(scope.row.operator)}}
          </template>

        </el-table-column>
        <el-table-column prop="content" label="操作内容" :min-width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.operator.indexOf('Format')>-1||scope.row.operator.indexOf('Quota')>-1">
              {{(scope.row.operator==='updateQuota')?`修改指定用户${scope.row.user}的空间为${scope.row.quota}GB`:
              scope.row.operator==='userFormat'?`格式化指定用户${scope.row.user}并修改其空间为${scope.row.quota}GB`:
              (scope.row.operator==='adminFormat')?`全局格式化并修改用户空间为${scope.row.quota}GB`:
              (scope.row.operator==='initQuota')?`全局修改空间为${scope.row.quota}GB`:''}}
            </div>
            <div v-else>
              <div>{{`文件名:${scope.row.fileName}`}}</div>
              <div>{{`文件大小:${scope.row.size}`}}</div>
              <div>{{`上传人:${scope.row.fileUser}`}}</div>
            </div>
          </template>

        </el-table-column>
        <!-- <el-table-column prop="fileName" label="文件名">
        </el-table-column>
        <el-table-column prop="size" label="文件大小">
        </el-table-column> -->
        <el-table-column prop="createTimeStr" label="操作时间">
        </el-table-column>
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
        applyType: '',
        typeList: [{
          label: '上传',
          value: 'upload'
        }, {
          label: '删除',
          value: 'userDel'
        }, {
          label: '管理员删除',
          value: 'adminDel'
        }, {
          label: '分享',
          value: 'share'
        }, {
          label: '取消分享',
          value: 'unshare'
        }, {
          label: '下载',
          value: 'download'
        }, {
          label: '全局格式化',
          value: 'adminFormat'
        }, {
          label: '指定用户格式化',
          value: 'userFormat'
        }, {
          label: '全局修改空间',
          value: 'initQuota'
        }, {
          label: '指定用户修改空间',
          value: 'updateQuota'
        }, ],
        // ouSelectList: [],
        // applyOu: [],
        opStartTime: '',
        no: false,
        tableData: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        // cpu: 0,
        // memory: 0,
        // disk: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
        // multSelection: [],
        // applyUser: '',
        // applyTable: '',
        applyState: '', //管理员使用
        // applyLoginState: '',
        userList: []
      }
    },
    created() {
      this.getVmList(1);
    //   if (this.localRole === 'admin') {
        this.getUserList();
        // this.getTypeList();
    //   }
      //   this.getOu()
    },
    // mounted() {
    //   //   this.$nextTick(() => {
    //   //     this.tableHeight = computedTableHeight()
    //   //   })
    //   //         this.$nextTick(() => {
    //   //              addScrollBar('#table-wrap')
    //   //   })
    // },
    // computed: {
    //   localRole() {
    //     return sessionStorage.getItem('role')
    //   },
    // },
    methods: {
      getOperator(op) {
        if (op === 'upload') {
          return '上传'
        } else if (op === 'userDel') {
          return '删除'
        } else if (op === 'adminDel') {
          return '管理员删除'
        } else if (op === 'share') {
          return '分享'
        } else if (op === 'unshare') {
          return '取消分享'
        } else if (op === 'download') {
          return '下载'
        } else if (op === 'adminFormat') {
          return '全局格式化'
        } else if (op === 'userFormat') {
          return '指定用户格式化'
        } else if (op === 'updateQuota') {
          return '指定用户修改空间'
        } else if (op === 'initQuota') {
          return '全局修改空间'
        }
      },
    //   clearC(v) {
    //     // console.log(v, this.applyOu)
    //     // if (v.length === 0) {
    //     this.getVmList('', 1)
    //     // }
    //   },
    //   visibleChange(v) {
    //     // if (this.applyOu.length===0) {
    //     //     // console.log(v, this.applyOu)
    //     //   return
    //     // }
    //     // if (v === false) { //才调接口
    //     //   this.getVmList('', 1)
    //     // }
    //   },
      //   getTypeList() {
      //     const url = `statistic/operationTypes`
      //     httpGet(url).then((res) => {
      //       this.typeList = res;
      //     }).catch((error) => {
      //       console.log(error)
      //     })
      //   },
      getUserList() {
        const url = `user/adminUserList?page=1&limit=100000`
        httpGet(url).then((res) => {
          this.userList = res.data;
        }).catch((error) => {
          console.log(error)
        })
      },
      //   getOu() {
      //     httpGet('tenant/findDivisions').then((res) => {
      //       if (res) {
      //         this.ouSelectList = res;
      //         //   console.log(this.ouSelectList)
      //         // this.form.ou = this.ouSelectList[0].value;
      //       } else {
      //         this.$message.error('通信错误')
      //       }
      //     }).catch((err) => {
      //       console.log(err)
      //     })
      //   },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          // user: this.applyUser,
          createTimeStr: this.opStartTime,
          user: this.applyState,
          operator: this.applyType,
          //   ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
        }
        const url = `bigFile/logList`
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
