<template>
  <div id="cateList">
    <div class="search-wrap">
      <!-- <el-input placeholder="请输入申请人" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
      </el-input>
      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyTable"  @keyup.enter.native="clearData" @clear="clearData(2)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择运行状态" clearable v-model="applyState"  @keyup.enter.native="clearData" @clear="clearData(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择登录状态" clearable v-model="applyLoginState"  @keyup.enter.native="clearData" @clear="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
      </el-select> -->
      <el-button type="primary" @click="addCate">新增</el-button>
    </div>
    <div class="table-wrap" id="table-wrap">
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
    :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55" v-if="tableData.length">
        </el-table-column> -->
        <el-table-column prop="cateName" label="板块名称" width="200">
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" >
        </el-table-column>
         <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0" :loading="btnLoading&&(btnIndex===scope.row.id)">{{btnLoading&&(btnIndex===scope.row.id)?'修改中':'修改'}}</el-button>
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0" :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}</el-button>
          </template>
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
        btnLoading: false,
        btnLoadingD:false,
        no: false,
        tableData: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
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
        addCate(){
            this.$prompt('请输入板块名称', '新增板块', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '请输入板块名称'
        }).then(({ value }) => {
            let params = {
                id:'',
                cateName:value
            }
         httpAjax('helpCate/add', params).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                });
                this.getVmList();
              } else {
                this.$message({
                  type: 'error',
                  message: '新增失败!'
                });
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '新增失败!'
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消新增'
          });       
        });
        },
        editCate(data){//修改板块
            this.$prompt('请输入板块名称', '修改板块', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '请输入板块名称',
          inputValue:data.cateName
        }).then(({ value }) => {
             this.btnIndex = data.id
             this.btnLoading=true;
            let params = {
                id:data.id,
                cateName:value
            }
         httpAjax('helpCate/add', params).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                this.getVmList();
              } else {
                this.$message({
                  type: 'error',
                  message: '修改失败!'
                });
              }
               this.btnLoading = false;
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '修改失败!'
              });
               this.btnLoading = false;
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
        },
     handleClick(data){//删除
           this.$confirm('确定删除该板块吗?', '删除板块', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             this.btnIndex = data.id
          this.btnLoadingD=true;
          let params={
              id:data.id
          }
            httpAjax('helpCate/delete', params).then(res => {
              if (res.success == "success") {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getVmList();
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }
          this.btnLoadingD=false;
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
          this.btnLoadingD=false;
            })
        }).catch(() => {

        })
            

        },
     searchData() {
        this.getVmList('',1)
      },
      clearData(num) {
        this.getVmList('',1)
      },
      // handleSelectionChange(val) {
      //   },
    //   checkSelect(selection, row) {
    //     if (selection.length > 1) {
    //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
    //     }
    //     this.multSelection = selection;
    //   },
      getVmList(first,page) {
          page?this.currentPage4 = page:'';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
        }
        const url = `helpCate/list?${Math.random()}`
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
          addScrollBar(dom,true)
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
.search-wrap{
    text-align: right;
}
.search-wrap button{
    margin-right:10px;
}
</style>
