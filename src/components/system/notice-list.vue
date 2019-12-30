<template>
  <div id="noticeList">
    <div class="search-wrap">
      <el-input placeholder="请输入通知标题" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
      </el-input>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px;" @click="updateDesk">新增</el-button>

    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="noticeTitle" label="标题">
        </el-table-column>
        <el-table-column prop="noticeContent" label="内容">
          <template slot-scope="scope">
            <div style="text-align:left;width:100%;overflow:hidden">
              {{scope.row.noticeContent}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:0">修改</el-button>
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <div class="page-wrap">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增推送" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='8%' @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="标题：" :label-width="formLabelWidth" prop="noticeTitle">
          <el-input v-model="aform.noticeTitle" placeholder='请输入标题(例如:国庆放假)' :style='{width:inputLabelWidth}'>
          </el-input>
        </el-form-item>
        <el-form-item label="内容：" :label-width="formLabelWidth" prop="noticeContent">
          <el-input type="textarea" v-model="aform.noticeContent" :autosize="{minRows: 10, maxRows: 12 }"
            placeholder='请输入内容' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
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
      //   var blow255 = (rule, value, callback) => {
      //     if (value && value.length <= 255) {
      //       callback()
      //     } else {
      //       callback('请填写描述')
      //     }
      //   }
      return {
        btnLoading: false,
        btnLoadingD: false,
        btnIndex: '',
        no: false,
        tableData: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
        multSelection: [],
        applyUser: '',
        // applyTable: '',
        // applyState: '',
        // applyLoginState: '',
        // loadingState: false,
        text: '请稍后',
        dialogFormVisible: false,
        aform: {
          id: '',
          noticeTitle: '',
          noticeContent: ''
        },
        rules2: {
          noticeTitle: [{
            required: true,
            message: '请输入标题',
            // validator: nan16,
            trigger: 'blur'
          }],
          noticeContent: [{
            required: true,
            message: '请输入内容',
            // validator: blow255,
            trigger: 'blur'
          }]
        },
        formLabelWidth: '130px',
        inputLabelWidth: '500px',
        dialogFormVisibleP: false
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
      updateDesk() { //点击新增
        this.dialogFormVisible = true;
      },
      editCate(data) { //修改
        this.aform = {
          id: data.id,
          noticeTitle: data.noticeTitle,
          noticeContent: data.noticeContent
        }
        this.dialogFormVisible = true;
      },
      handleClick(data) { //删除
        this.$confirm('确定删除该内容吗?', '删除内容', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoadingD = true;
          let params = {
            id: data.id
          }
          httpAjax('notice/delete', params).then(res => {
            if (res) {
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
            this.btnLoadingD = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnLoadingD = false;
          })
        }).catch(() => {})
      },
      resetD(formName) { //重置表单
        switch (formName) {
          case 'aform':
            this.aform = {
              id: '',
              noticeContent: '',
              noticeTitle: ''
            }
            this.$refs['aform'].resetFields();
            break;
          default:
            break;
        }
      },
      addAccount(formName) { //提交
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('notice/add', f).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                //     this.multSelection = []
                //     this.getVmList()
                //   }
                // });
              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败!'
                });
              }
              this.getVmList()
              this.dialogFormVisible = false;
              this.btnLoading = false;
            }).catch(() => {
              this.btnLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

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
          noticeTitle: this.applyUser
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `notice/list?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableData = res.data;
          this.tableHeight = computedTableHeight()
          this.vmTableLoadingState = false;
          this.count = res.count;
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
    justify-content: flex-end;
    align-items: center;
    color: #606266;
  }

</style>
