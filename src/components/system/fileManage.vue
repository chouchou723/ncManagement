<template>
  <div id="fileMange">
    <div class="search-wrap">
        <el-input placeholder="请输入文件名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择上传人" filterable clearable v-model="applyState"
        @change="getVmList('', 1)"  >
        <el-option v-for="(item,index) in userList" :key="index" :value="item.name" :label="item.name">
          {{item.name}}</el-option>
      </el-select>
      <el-date-picker v-model="opStartTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择上传时间" :editable="no"
        clearable @change="searchData" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-select style="width:190px;" placeholder="请选择文件状态" filterable clearable v-model="applyType"
        @change="getVmList('', 1)"  >
        <el-option v-for="(item,index) in typeList" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
     <!--  <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader> -->
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>


      <!-- <el-button icon="el-icon-search" circle @click="searchData"></el-button> -->
    </div>
    <div class="table-wrap">
      <el-table id="table-wrap" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
        <el-table-column prop="fileName" label="文件名称" :min-width="200">
          <template slot-scope="scope">
            <div style="padding:9px 0">
              {{scope.row.fileName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小">
        </el-table-column>
        <el-table-column prop="user" label="上传人">
        </el-table-column>
        <el-table-column prop="type" label="文件状态">
          <template slot-scope="scope">
            <div>
              {{scope.row.del==='yes'?'已删除':scope.row.share==='yes'?'已分享':'正常'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="操作时间">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="downFile(scope.row.fileName,scope.row.path,scope.row.uuid)" type="text" style="padding:0">下载
            </el-button>
            <el-button @click="delFile(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">
              {{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
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
        typeList: [{label:'已分享',value:'share'},{label:'已删除',value:'userDel'},{label:'正常',value:'normal'}],
        ouSelectList: [],
        applyOu: [],
        opStartTime: '',
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
        userList: [],
        btnLoadingD:false
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
        downFile(name, path,uuid) { //下载
        // let params = {
        //   fileName: name,
        //   path: path
        // }
        // let url = 'bigFile/download'
        // httpAjax(url, params).then((res) => {}).catch((err) => {
        //   console.log(err)
        // })
        window.open(`/api/bigFile/download?fileName=${name}&path=${path}&uuid=${uuid}`)
      },
      delFile(data){
          this.$confirm('确定删除该文件吗?', '删除文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoadingD = true;
          let params = {
            uuids: data.uuid
          }
          httpAjax('bigFile/adminDelete', params).then(res => {
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
          fileName: this.applyUser,
          createTimeStr: this.opStartTime,
            user: this.applyState,
            status: this.applyType,
          //   ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
        }
        const url = `bigFile/adminList`
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
