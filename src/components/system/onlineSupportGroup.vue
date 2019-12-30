<template>
  <div id="onlineSupportGroup">
    <div class="search-wrap">
      <el-input placeholder="请输入用户名" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
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
        <el-table-column prop="name" label="用户名">
        </el-table-column>
        <el-table-column prop="role" label="角色">
            <template >
                <div>
                    在线支持组
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="mail" label="邮箱">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:12px 0"
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
    <el-dialog title="ad用户列表" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' @close='resetD("aform")' width="50%">
      <el-form :model="aform" ref="aform">
        <el-form-item label="请选择FA：" label-width="90px" prop="fa">
          <el-select style="width:190px;" placeholder="请选择FA" v-model="aform.faIp">
            <el-option v-for="(item,index) in faList" :key="index" :value="item.faIP" :label="item.faName">
              {{item.faName}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="table-wrap" id="table-wrapTran">
        <el-table :data="userListData" height="360" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" @select="checkSelect1" @row-click="rowClick" :cell-style="{'text-align':'center'}">
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
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')" :disabled="this.multSelectionTran.length===0">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
      //   var blow255 = (rule, value, callback) => {
      //     if (value && value.length <= 255) {
      //       callback()
      //     } else {
      //       callback('请填写描述')
      //     }
      //   }
      return {
        faList: [],
        userListData: [],
        btnLoading: false,
        btnLoadingD: false,
        btnIndex: '',
        no: false,
        tableData: [],
        count: 0,
        countTran: 0,
        tableHeight: 400,
        total: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentPage5: 1,
        currentSize: 10,
        currentSize1: 10,
        applyUser: '',
        loadingState: false,
        text: '请稍后',
        dialogFormVisible: false,
        aform: {
          id: '',
          faIp: '',
        },
        formLabelWidth: '130px',
        inputLabelWidth: '200px',
        multSelectionTran:[]
      }
    },
    created() {
      this.getVmList(1)
      this.refreshData()
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    methods: {
          rowClick(row, column, event) {
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
        if (selection.length > 1) {
          this.$refs.multipleTableTran.toggleRowSelection(selection[0]);
        }
        this.multSelectionTran = selection;
      },
      refreshData() {//获取fa
        httpAjax('system/faList').then(res => {
          this.faList = res.data;
          this.aform.faIp = res.data[0].faIP;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
        })
      },
      updateDesk() { //获取转移名单
      this.refreshData();
        let url = `user/adminUserList?&${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}`
        httpGet(url).then((res) => {
          if (res.data) {
            this.userListData = res.data
            this.countTran = res.count
            this.dialogFormVisible = true
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
      // updateDesk(){
      //     this.postpone()
      //     this.dialogFormVisible = true;
      // },
      // editCate(data){
      //     this.aform = {
      //         id:data.id,
      //         noticeTitle:data.noticeTitle,
      //         noticeContent:data.noticeContent
      //     }
      //      this.dialogFormVisible = true;
      // },
      handleClick(data) { //删除
        this.$confirm('确定取消该在线支持组角色吗?', '取消在线支持组角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoadingD = true;
          let params = {
            id: data.id
          }
          httpAjax('tenant/delete', params).then(res => {
            if (res.success == 'success') {
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
        }).catch(() => {

        })


      },
      resetD(formName) {//重置
        switch (formName) {
          case 'aform':
            this.aform = {
              id: '',
              faIp: ''
            }
             this.multSelectionTran = [];
              this.currentPage5 = 1;
             this.currentSize1 = 10;
            this.$refs['aform'].resetFields();
            break;
          default:
            break;
        }
      },
      addAccount(formName) { //提交故障
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
          f.name = this.multSelectionTran[0].name
            f.role='support'
          if (valid) {
            this.btnLoading = true;
            httpAjax('user/setUserRole', f).then(res => {
              if (res.resultCode == 0) {
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
                this.dialogFormVisible = false;
                this.getVmList()
              } else {
                this.$message({
                  type: 'error',
                  message: '此用户不存在!'
                });
              }
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
          name: this.applyUser,
          role: 'support'
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `tenant/tenantList?${Math.random()}`
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
      handleCurrentChange1(val) {
          this.multSelectionTran = []
        this.currentPage5 = val;
        this.updateDesk()
      },
      handleSizeChange(val) {
        this.currentSize = val;
        this.getVmList()
      },
      handleSizeChange1(val) {
          this.multSelectionTran = []
        this.currentSize1 = val;
        this.updateDesk()
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
