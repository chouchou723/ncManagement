<template>
  <div id="fileUserManage" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入用户名" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <!-- <el-select style="width:190px;" placeholder="请选择角色" clearable v-model="applyState" @keyup.enter.native="clearData"
        @change="clearData(3)">
        <el-option v-for="(item,index) in roleList" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select> -->
      <!-- <el-select style="width:190px;" placeholder="请选择标签" clearable v-model="tagState" @keyup.enter.native="clearData"
        @change="clearData(3)">
        <el-option v-for="(item,index) in tagListSelect" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select> -->
      <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <!-- <el-button type="primary"
       style="float:right;margin-right:10px;"   @click="exportData" >导出</el-button>
    -->
    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" ref="multipleTable" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="name" label="用户名">
          <template slot-scope="scope">
            <div style="padding:9px 0">
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="domainUserName" label="域用户">
        </el-table-column>
        <!-- <el-table-column prop="role" label="角色" width="120">
          <template slot-scope="scope">
            {{ scope.row.role==='asset'?'资产管理员':scope.row.role==='tenant'?'云管理员':scope.row.role==='support'?'在线支持组':scope.row.role==='troubleshooting'?'故障报修组':'普通用户'}}
          </template>
        </el-table-column> -->
        <el-table-column prop="ou" label="部门OU">
          <template slot-scope="scope">
            <!-- <div style="display:flex;justify-content:flex-start;flex-wrap:wrap"> -->
            <!-- <el-tag type="info"  @click.native="checkTagOu(scope.row.ou)" style="cursor:pointer"> -->
            <!-- <el-tag type="info"  @click.native="checkTagOu(scope.row.ou)" style="cursor:pointer"> -->
            {{scope.row.ou?scope.row.ou.split(',')[1].split('=')[1]:'暂无'}}
            <!-- </el-tag> -->

            <!-- </div> -->
          </template>
          <!-- <template slot-scope="scope">
            {{scope.row.ou?scope.row.ou.split(',')[1].split('=')[1]:''}}
          </template> -->
        </el-table-column>

        <!-- <el-table-column label="" width="100">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0" v-if=" scope.row.role!=='asset'"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">
             修改</el-button>
          </template>
        </el-table-column> -->
        <el-table-column prop="quota" label="文件总空间">
          <template slot-scope="scope">
            {{scope.row.quota}}GB
          </template>
        </el-table-column>
        <el-table-column prop="mail" label="空间使用情况">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="(scope.row.rate-0).toFixed(2)"
              :status="scope.row.rate>50?'exception':''"></el-progress>
            <div>当前已使用:{{scope.row.usedStr}},剩余:{{scope.row.left}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="mail" label="邮箱">
        </el-table-column> -->
        <!-- <el-table-column prop="createTimeStr" label="创建时间">
        </el-table-column> -->
        <!-- <el-table-column prop="updateTimeStr" label="最近登录时间">
        </el-table-column> -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div style="line-height:20.5px;">
              <el-button @click="editCharacter(scope.row)" type="text" style="padding:0 0 4px 0">
                修改空间</el-button>
              <!-- <el-button @click="openResourceTransfer(scope.row)" type="text" v-if="scope.row.role==='tenant'"
                style="color:#f10000;margin-left:0;padding:0;">资源转移</el-button> -->
              <!-- <el-button @click="handleClickChar(scope.row)" type="text" style="color:#f10000;margin-left:0;padding:0;"
                v-if=" scope.row.role!=='user'&&!!scope.row.role" :loading="btnLoadingD&&(btnIndex===scope.row.id)">
                {{btnLoadingD&&(btnIndex===scope.row.id)?'取消中':'取消角色'}}</el-button> -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0" v-if=" scope.row.role!=='asset'"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">
              {{btnLoadingD&&(btnIndex===scope.row.id)?'设置中':'设置资产管理员'}}</el-button>
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:12px 0"
              v-if=" scope.row.role==='asset'" :loading="btnLoadingD&&(btnIndex===scope.row.id)">
              {{btnLoadingD&&(btnIndex===scope.row.id)?'解除中':'解除资产管理员'}}</el-button>
          </template>
        </el-table-column> -->
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

    <!-- 修改空间  -->
    <el-dialog title="修改空间" :visible.sync="editRoleForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='13%' @close='resetD("rform")' width="40%">
      <div>
        <el-form :model="rform" ref="rform">
          <el-form-item label="用户总空间大小：" prop="quota">
            <el-input-number v-model="rform.quota" controls-position="right" :min="Math.ceil(backData.used/1000/1000/1000)">
            </el-input-number>
          </el-form-item>
          <el-form-item label="格式化：" prop="init">
            <el-checkbox v-model="rform.init" style="margin-left:15px;"></el-checkbox>
            <div style="color:red">※勾选格式化后,修改用户空间的同时将格式化用户所有文件!</div>
            </el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount">确
          定</el-button>
        <el-button @click="editRoleForm = false">取 消</el-button>
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
        loadingState: false,
        text: '请稍后',
        num: 1,
        sendState: '',
        messageList: [],
        transferList: [],
        btnLoading: false,
        tagState: '',
        rform: {
          quota: 0,
          init: false
        },
        editRoleForm: false,
        resourceForm: false,
        applyState: '',
        // roleList: [{
        //   value: 'user',
        //   label: '普通用户'
        // }, {
        //   value: 'tenant',
        //   label: '云管理员'
        // }, {
        //   value: 'support',
        //   label: '在线支持组'
        // }, {
        //   value: 'troubleshooting',
        //   label: '故障保修组'
        // }, {
        //   value: 'asset',
        //   label: '资产管理员'
        // }, ],
        tagList: [],
        messageFormMul: false,
        aform: {
          message: ''
        },
        currentPage5: 1,
        currentSize1: 10,
        currentPageT: 1,
        currentSizeT: 10,
        countTran: 0,
        countTransfer: 0,
        currentPage6: 1,
        currentSize2: 10,
        countMessage: 0,
        tagListSelect: [],
        transformForm: false,
        messageForm: false,
        messageFormOu: false,
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
        applyUser: '',
        multSelection: [],
        multSelectionTran: [],
        multSelectionTransfer: [],
        backTag: {
          tagId: '',
          name: ''
        },
        backData: {
          role: ''
        },
        typeListS: {},
        typeList: ['primary', 'success', 'warning', 'danger', 'info'],
        dialogMessage: false,
        transferData: {},
        backId: '',
        backNum: 0,
        ouSelectList: [],
        applyOu: []
      }
    },
    created() {
      this.getVmList(1);
      this.getOu();
      //   this.getTag();
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    computed: {
      //   mulUserTitle() {
      //     if (this.multSelection.length === 0) {
      //       return ''
      //     } else if (this.multSelection.length > 5) {
      //       return `发送给 ${this.multSelection[0].name},${this.multSelection[1].name},${this.multSelection[2].name},${this.multSelection[3].name},${this.multSelection[4].name}等用户`
      //     } else if (this.multSelection.length < 5) {
      //       let title = this.multSelection.map(item => {
      //         return item.name
      //       })
      //       return `发送给 ${title.join(',')}用户`
      //     }
      //   }
    },
    methods: {
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
      clearC(v) {
        // console.log(v, this.applyOu)
        // if (v.length === 0) {
        this.getVmList('', 1)
        // }
      },
      addAccount(formName) { //修改空间提交
        // this.$refs[formName].validate((valid) => {
        let f = {
          name: this.backData.name,
          quota: this.rform.quota,
          init:this.rform.init
        };
        this.btnLoading = true;
        httpAjax('userQuota/updateQuota', f).then(res => {
          if (res.result === 'success') {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
            //   confirmButtonText: '确定',
            //   type: 'success',
            //   callback: action => {
            //     this.multSelection = []
            //     this.getVmList()
            //   }
            // });
            this.editRoleForm = false;
            this.getVmList()
          } else {
            this.$message({
              type: 'error',
              message: res.resultDesc
            });
          }
          this.btnLoading = false;
        }).catch(() => {
          this.btnLoading = false;
        })
        // });
      },
      resetD(formName) {
        switch (formName) {
          case 'rform':
            this.rform = {
              quota: 0,
              init:false
            }
            this.$refs['rform'].resetFields();
            break;
          default:
            break;
        }
      },


      //   rowClick(row, column, event) {//列表选择
      //     let target = event.target
      //     // console.log(event)
      //     if (target.localName === 'button' || target.parentNode.localName === 'button'||target.className.indexOf('el-input-number')===0||target.parentNode.className.indexOf('el-input-number')===0) {
      //       return
      //     }
      //     if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length === 0) {
      //       //   this.$refs.multipleTable.toggleRowSelection(row);
      //       this.multSelection = [...this.multSelection, row];
      //     } else if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length ===
      //       1) {
      //       this.multSelection = this.multSelection.filter(item => item.id !== row.id);
      //     } else {
      //       this.multSelection = [row];
      //     }
      //     // console.log(this.multSelection)
      //     this.$refs.multipleTable.toggleRowSelection(row);
      //   },
      //   handleSelectionChangeMerge(val) { //列表选择
      //     this.multSelection = val;
      //   },
      //   handleCurrentChange1(val) {
      //     this.multSelectionTran = [];
      //     this.currentPage5 = val;
      //     this.openTag()
      //   },
      //   handleSizeChange1(val) {
      //     this.multSelectionTran = [];
      //     this.currentSize1 = val;
      //     this.openTag()
      //   },


      //   editCate(data) { //设置资产管理员
      //     this.btnIndex = data.id
      //     this.btnLoadingD = true;
      //     let params = {
      //       name: data.name,
      //       role: 'asset'
      //     }
      //     httpAjax('user/setRole', params).then(res => {
      //       if (res) {
      //         this.$message({
      //           type: 'success',
      //           message: '设置成功'
      //         });
      //         this.getVmList();
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '设置失败!'
      //         });
      //       }
      //       this.btnLoadingD = false;
      //     }).catch(() => {
      //       this.$message({
      //         type: 'error',
      //         message: '删除失败!'
      //       });
      //       this.btnLoadingD = false;
      //     })
      //   },

      editCharacter(data) { //修改空间
        this.backData = data;
        this.rform.quota = data.quota;
        this.editRoleForm = true;
      },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },

      getVmList(first, page) {
        this.multSelection = [];
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          name: this.applyUser,
          ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `userQuota/quotaList?${Math.random()}`
        httpGet(url, para).then((res) => {
          //   this.tableData = res.data;
          this.tableData = res.data

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
        this.multSelection = [];
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.multSelection = [];
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
<style>
  #userListPage #table-wrap .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }

</style>
