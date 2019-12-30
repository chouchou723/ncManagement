<template>
  <div id="adminOnline" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入使用人" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-input placeholder="请输入桌面名称" style="width:185px;" clearable v-model="applyTable"
        @keyup.enter.native="clearData" @clear="clearData(2)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择运行状态" clearable v-model="applyState"
        @keyup.enter.native="clearData" @change="clearData(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-select style="width:190px" placeholder="请选择登录状态" clearable v-model="applyLoginState"
        @keyup.enter.native="clearData" @change="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
    </div>
    <div class="table-wrap" id="table-wrap">
      <div class="newBtnWrap">
        <!-- <Button type="primary">启动</Button> -->
        <el-button-group>

          <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('start'))"
            @click="start" icon="el-icon-circle-check-outline">启动</el-button>
             <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('stop'))"
            @click="stop" icon="iconfont icon-zanting" >停止</el-button>
          <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('restart'))"
            @click="restart" icon="el-icon-refresh">重启</el-button>
          <el-button size="small" type="primary" :disabled="!(multSelection.length===1&&checkDisable('edit'))"
            @click="updateDesk" icon="el-icon-edit-outline">修改规格</el-button>
          <el-button size="small" type="primary" :disabled="!multSelection[0].id" icon="el-icon-sort" @click="postpone">
            资产转移
          </el-button>
          <el-button size="small" type="danger" :disabled="!(multSelection.length===1&&checkDisable('quit'))"
            @click="detach" icon="el-icon-close">清退</el-button>
          <!-- <el-button size="small" type="success" @click="loginCloud">云桌面登陆</el-button> -->
        </el-button-group>
        <el-button-group style="float:right;margin-top: 10px;margin-right: 10px;">

          <el-button size="small" type="primary" @click="exportData" icon="el-icon-download">导出
          </el-button>
          <el-button icon="el-icon-refresh" size="small" type="primary" @click="refreshData">同步桌面
          </el-button>
        </el-button-group>

      </div>
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        @row-click="rowClick" @select="checkSelect" stripe :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="user" label="使用人">
        </el-table-column>
        <el-table-column prop="computerName" label="桌面名称" :min-width="150">
        </el-table-column>
         <el-table-column prop="merName" label="所属商品" :min-width="150">
             <template slot-scope="scope">
                 {{scope.row.merName||'(FA同步桌面)'}}
          </template>
        </el-table-column>
        <el-table-column prop="operatorAccount" label="所属管理员" width="100">  
        </el-table-column>
        <el-table-column prop="cpuRate" label="CPU使用率" width="100">
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
        <!-- <el-table-column prop="networkDelays" label="网络延迟" width="100">
        </el-table-column> -->
        <el-table-column prop="ip" label="IP地址" width="120">
        </el-table-column>
        <!-- <el-table-column prop="operatorAccount" label="审批人" width="100">
        </el-table-column> -->
        <el-table-column prop="deskType" label="桌面类型">
          <template slot-scope="scope">
            <div>
              {{clouldType(scope)||'未知'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
          <template slot-scope="scope">
            <div>
              <!-- <span style="width:120px;display:inline-block;text-align:right"> -->
              {{scope.row.feature}}
              <!-- </span> -->
              <!-- <el-button  size="mini" type="text" v-if="scope.row.runState!=='stopped'"
                style="margin-left:10px" @click="updateDisk(scope.row)">修改</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="runState" label="运行状态">
          <template slot-scope="scope">
            <div>
              {{runState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="loginState" label="登录状态">
          <template slot-scope="scope">
            <div>
              {{loginState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="attachState" label="分配状态">
          <template slot-scope="scope">
            <div>
              {{branchState(scope)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opType" label="模式" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.runState === 'stopped'">
              {{opTypeState(scope)}}
            </div>
            <div v-if="scope.row.runState !== 'stopped'">
              <el-radio-group v-model="scope.row.opType" size="mini" @change="maintain(scope)"
                v-loading="loadingRadio&&(btnIndex===scope.row.id)">
                <el-radio-button label="unset">工作模式</el-radio-button>
                <el-radio-button label="set">维护模式</el-radio-button>
              </el-radio-group>
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
    <!-- 修改规格 -->
    <el-dialog title="修改规格" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='9%' width="40%" @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="CPU(核)：" :label-width="formLabelWidth" prop="cpu">
          <el-input-number v-model="aform.cpu" controls-position="right" :min="multSelection[0].cpu" :max="16"
            :style='{width:inputLabelWidth}'>
          </el-input-number>
          <!-- <el-input v-model="aform.cpu" placeholder='请输入1至16整数(单位G)' :style='{width:inputLabelWidth}'></el-input> -->
        </el-form-item>
        <el-form-item label="内存(GB)：" :label-width="formLabelWidth" prop="memory">
          <el-input-number v-model="aform.memory" controls-position="right" :min="multSelection[0].memory" :max="32"
            :style='{width:inputLabelWidth}'>
          </el-input-number>
          <!-- <el-input v-model="aform.memory" placeholder='请输入1至32整数(单位G)' :style='{width:inputLabelWidth}'></el-input> -->
        </el-form-item>
        <el-form-item label="磁盘容量(GB)：" :label-width="formLabelWidth" prop="disk">
          <el-input-number v-model="aform.disk" controls-position="right" :min="multSelection[0].disk" :max="1024"
            :style='{width:inputLabelWidth}'>
          </el-input-number>
          <!-- <el-input v-model="dform.disk" placeholder='请输入10至1024整数(单位G)' :style='{width:inputLabelWidth}'></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="描述：" :label-width="formLabelWidth" prop="specDes">
          <el-input type="textarea" v-model="aform.specDes" :autosize="{minRows: 6, maxRows: 6 }"
            placeholder='请输入描述,最多255个字' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item> -->
        <el-form-item label="" :label-width="formLabelWidth">
          <div style="color:#f10000;text-align: left;font-size: 12px;line-height: 20px;">修改成功之后需要重启</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 资产转移  -->
    <el-dialog title="选择移交人" :visible.sync="transformForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='6%' @close='resetD("transformForm")'>
      <div class="search-wrap">
        <el-input placeholder="请输入移交人名称" v-model="queryUserName" style="width:185px;" clearable
          @keydown.enter.native="queryUserList" @clear="queryUserList" />
        <el-button type="ghost" @click="queryUserList"><i class="el-icon-search"></i>查询</el-button>
      </div>
      <div class="table-wrap" id="table-wrapTran">
        <el-table :data="userListData" height="360" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClick1" @select="checkSelect1"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="移交人">
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
          @click="serviceConfirm">确 定</el-button>
        <el-button @click="transformForm = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 增加磁盘 -->
    <el-dialog title="增加磁盘" :visible.sync="dialogFormVisibleDisk" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='15%' width="30%" @close='resetD("dform")'>
      <el-form :model="dform" :rules="ruled" ref="dform">
        <el-form-item label="磁盘容量(GB)：" :label-width="formLabelWidth" prop="disk">
          <el-input-number v-model="dform.disk" controls-position="right" :min="10" :max="1024">
          </el-input-number>
          <!-- <el-input v-model="dform.disk" placeholder='请输入10至1024整数(单位G)' :style='{width:inputLabelWidth}'></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addDisk('dform')">确 定</el-button>
        <el-button @click="dialogFormVisibleDisk = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 同步桌面 -->
    <el-dialog title="同步桌面" :visible.sync="dialogFormVisibleSyn" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='15%' width="30%" @close='resetD("dform")'>
      <el-form :model="sform" :rules="rulesyn" ref="sform">
        <el-form-item label="请选择FA：" :label-width="formLabelWidth" prop="fa">
          <el-select style="width:190px;" placeholder="请选择FA" v-model="sform.fa">
            <el-option v-for="(item,index) in faList" :key="index" :value="item.faIP" :label="item.faName">
              {{item.faName}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="synDesk('sform')">确 定</el-button>
        <el-button @click="dialogFormVisibleSyn = false">取 消</el-button>
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
      var nan16 = (rule, value, callback) => {
        if (value && value % 1 === 0 && value <= 16) {
          callback()
        } else {
          callback('请输入正确的数字')
        }
      }
      var nan32 = (rule, value, callback) => {
        if (value && value % 1 === 0 && value <= 32) {
          callback()
        } else {
          callback('请输入正确的数字')
        }
      }
      var nan1024 = (rule, value, callback) => {
        if (value && value % 1 === 0 && value <= 1024) {
          callback()
        } else {
          callback('请输入正确的数字')
        }
      }
      var blow255 = (rule, value, callback) => {
        if (value && value.length <= 255) {
          callback()
        } else {
          callback('请填写描述')
        }
      }
      return {
        queryUserName: '',
        btnIndex: '',
        btnLoading: false,
        userListData: [],
        transformForm: false,
        loadingRadio: false,
        no: false,
        tableData: [],
        count: 0,
        countTran: 0,
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
        currentPage5: 1,
        currentSize1: 10,
        multSelection: [{
          disk: 0
        }],
        multSelectionADD: [],
        multSelectionTran: [],
        applyUser: '',
        applyTable: '',
        applyState: '',
        applyLoginState: '',
        loadingState: false,
        text: '请稍后',
        dialogFormVisible: false,
        aform: {
          cpu: '',
          memory: '',
          disk: '',
          specDes: ''
        },
        rules2: {
          cpu: [{
            required: true,
            validator: nan16,
            trigger: 'blur'
          }],
          memory: [{
            required: true,
            validator: nan32,
            trigger: 'blur'
          }],
          disk: [{
            required: true,
            validator: nan1024,
            trigger: 'blur'
          }],
          specDes: [{
            required: true,
            validator: blow255,
            trigger: 'blur'
          }]
        },
        formLabelWidth: '130px',
        inputLabelWidth: '300px',
        dialogFormVisibleP: false,
        postform: {
          Ftime: ''
        },
        postformrule: {
          Ftime: [{
            required: true,
            message: '请选择延长的日期',
            // validator: nan32,
            trigger: 'blur'
          }],
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        dialogFormVisibleDisk: false,
        dform: {
          disk: ''
        },
        ruled: {
          disk: [{
            required: true,
            validator: nan1024,
            trigger: 'blur'
          }],
        },
        faList: [],
        dialogFormVisibleSyn: false,
        sform: {
          fa: ''
        }
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
        this.multSelectionTran = [];
        this.currentPage5 = 1;
        this.currentSize1 = 10;
        this.postpone();
      },
      rowClick(row, column, event) {
        if (this.multSelection.length > 0 && this.multSelection[0].id !== row.id) {
          this.$refs.multipleTable.toggleRowSelection(this.multSelection[0]);
          this.multSelection = [row];
        } else if (this.multSelection.length > 0 && this.multSelection[0].id === row.id) {
          this.multSelection = [{
            disk: 0
          }];
        } else {
          this.multSelection = [row];
        }
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      checkSelect(selection, row) {
        //   if(selection.length===1){
        //   }
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.multSelection = selection;
        // console.log(selection, row)
      },
      serviceConfirm() { //转移
        let data = this.multSelection[0]
        let params = {};
        params.newUser = this.multSelectionTran[0].domainUserName;
        params.oldUser = data.computerName.split('\\')[0] + '\\' + data.user;
        params.vmId = data.vmId;
        params.siteId = data.siteId;
        params.faIp = data.faIp;
        params.computerName = data.computerName;
        this.btnLoading = true;
        httpAjax('desktop/migration', params).then(res => {
          if (res.result == 'success') {
            this.$message({
              type: 'success',
              message: '转移成功!'
            });
            this.getVmList()
            this.multSelection = [{
              disk: 0
            }]
            this.transformForm = false;
          } else {
            this.$message({
              type: 'error',
              message: res.desc || '通讯错误'
            });
          }
          this.btnLoading = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
          this.btnLoading = false;

        })
      },
      postpone() { //获取转移名单
        let name = this.multSelection[0].user
        let url =
          `user/adminUserList?&myself=${name}&${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&name=${this.queryUserName}`
        httpGet(url).then((res) => {
          if (res.data) {
            this.userListData = res.data
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
      maintain(data) { //维护模式
        this.btnIndex = data.row.id;
        let checkStatus = data.row;
        let params = {};
        params.vmId = checkStatus.vmId;
        params.faIp = checkStatus.faIp;
        params.siteId = checkStatus.siteId;
        params.opType = checkStatus.opType;
        let type = checkStatus.opType === 'set' ? 'unset' : 'set'
        this.loadingRadio = true;
        // var loadIngNode = psLoadIng('正在切换模式, 请稍后...')
        httpAjax('desktop/maintainVM', params).then(res => {
          if (res.resultCode == "0") {
            this.$message({
              type: 'success',
              message: '操作成功!切换需要一定时间,请稍后确认'
            });
            this.getVmList()
          } else {
            data.row.opType = type;
            this.$message({
              type: 'error',
              message: res.resultDesc || '通讯错误'
            });
          }
          this.loadingRadio = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
          this.loadingRadio = false;
          data.row.opType = type;
        })
      },
      synDesk(formName) {
        var params = {};
        params.faIp = this.sform.fa;
        this.text = '正在同步,请稍后...';
        this.loadingState = true;
        httpAjax('desktop/queryVmInfo', params).then(res => {
          if (res.success == 'success') {
            this.$message({
              type: 'success',
              message: '同步成功!'
            });
            // this.$alert('同步成功!', '同步桌面', {
            //     confirmButtonText: '确定',
            //     type: 'success',
            //     callback: action => {
            //         // this.multSelection = [{disk:0}]
            this.getVmList()
            //     }
            // });
          } else {
            this.$message({
              type: 'error',
              message: '同步失败!'
            });
          }
          this.loadingState = false;
          this.dialogFormVisibleSyn = false;
        }).catch(() => {
          this.loadingState = false;
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
        })
      },
      refreshData() {
        httpAjax('system/faList').then(res => {
          this.faList = res.data;
          this.sform.fa = res.data[0].faIP;
          this.dialogFormVisibleSyn = true
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
        })
      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            this.aform = {
              cpu: '',
              memory: '',
              disk: '',
              specDes: ''
            }
            this.$refs['aform'].resetFields();
            break;
          case 'sform':
            this.sform = {
              fa: ''
            }
            this.$refs['sform'].resetFields();
          case 'dform':
            this.dform = {
              disk: ''
            }
            this.$refs['dform'].resetFields();
          case 'transformForm':
            this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
            this.multSelectionTran = []
            this.userListData = [];
            this.currentPage5 = 1;
            this.currentSize1 = 10;
          default:
            break;
        }
      },
      updateDisk(data) {
        this.multSelectionADD = [data];
        this.dform.disk = data.disk;
        this.dialogFormVisibleDisk = true;
      },
      addDisk() { //增加磁盘
        this.$refs['dform'].validate((valid) => {
          let params = {};
          let checkStatus = this.multSelectionADD[0]
          params.computerName = checkStatus.computerName;
          params.faIp = checkStatus.faIp;
          params.disk = this.dform.disk;
          params.vmId = checkStatus.vmId;
          params.siteId = checkStatus.siteId;
          params.clusterId = checkStatus.clusterId;
          if (valid) {
            this.btnLoading = true;
            httpAjax('desktop/attachVolume', params).then(res => {
              if (res.resultCode == "0") {
                this.$message({
                  type: 'success',
                  message: '修改成功! 需要花费一些时间,请耐心等待!'
                });
                // this.$alert('修改成功! 需要花费一些时间,请耐心等待', '增加磁盘', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                //     // this.multSelection = [{disk:0}]
                this.getVmList()
                //   }
                // });
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc
                });
              }
              this.dialogFormVisibleDisk = false;
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
      addAccount(formName) { //修改规格
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
        //   f.disk = f.disk - this.multSelection[0].disk;
          f.balance = f.disk-this.multSelection[0].disk;
          let checkStatus = this.multSelection[0]
          f.computerName = checkStatus.computerName;
          f.faIp = checkStatus.faIp;
          f.vmId = checkStatus.vmId;
          f.siteId = checkStatus.siteId;
          f.merId = checkStatus.merId;
          f.clusterId = checkStatus.clusterId;

          if (valid) {
            this.btnLoading = true;
            httpAjax('desktop/updateInstance', f).then(res => {
              if (res.resultCode == "0") {
                this.dialogFormVisible = false;
                this.$message({
                  type: 'success',
                  message: '修改成功,需要重启虚机!'
                });
                // this.$alert('修改成功,需要重启虚机!', '修改规格', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                this.multSelection = [{
                  disk: 0
                }]
                this.getVmList()
                //   }
                // });
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      updateDesk() {
        this.aform.cpu = this.multSelection[0].cpu;
        this.aform.memory = this.multSelection[0].memory;
        this.aform.disk = this.multSelection[0].disk;
        this.dialogFormVisible = true;
      },
      start() {
        let params = {};
        let checkStatus = this.multSelection[0]
        params.vmId = checkStatus.vmId;
        params.faIp = checkStatus.faIp;
        params.siteId = checkStatus.siteId;

        this.text = '正在启动虚机, 请稍后...'
        this.loadingState = true;
        httpAjax('desktop/start', params).then(res => {
          this.loadingState = false;
          if (res.resultCode == '0') {
            this.$message.success('启动需要一定的时间，请耐心等待!')
            // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
            //   confirmButtonText: '确定',
            //   type: 'success',
            //   callback: action => {
            //     this.multSelection = [{disk:0}]
            //     this.getVmList()
            //     // this.$message({
            //     //   type: 'info',
            //     //   message: `action: ${ action }`
            //     // });
            //   }
            // });
            // layer.alert('请通知管理员配置UNS连接地址!', {
            //     icon: 5
            // });
          } else {
            this.$message({
              type: 'error',
              message: res.resultDesc
            });
          }
          this.multSelection = [{
            disk: 0
          }]
          this.getVmList()
        }).catch(() => {
          this.loadingState = false;
        })
      },
       stop() {
        this.$confirm('确定要停止该桌面?', '停止桌面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          let checkStatus = this.multSelection[0]
          params.vmId = checkStatus.vmId;
          params.faIp = checkStatus.faIp;
          params.siteId = checkStatus.siteId;
          this.text = '正在停止虚机, 请稍后...'
          this.loadingState = true;
          httpAjax('merchandise/stopInstance', params).then(res => {
            this.loadingState = false;
            if (res.resultCode == '0') {
              this.$message.success('停止虚机成功')
              // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     this.multSelection = [{disk:0}]
              //     this.getVmList()
              //     // this.$message({
              //     //   type: 'info',
              //     //   message: `action: ${ action }`
              //     // });
              //   }
              // });
              // layer.alert('请通知管理员配置UNS连接地址!', {
              //     icon: 5
              // });
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc
              });
            }
            this.multSelection = [{
              disk: 0
            }]
            this.getVmList()
          }).catch(() => {
            this.loadingState = false;
          })
        }).catch(() => {

        })

      },
      restart() {
        this.$confirm('确定要重启该桌面?', '重启桌面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          let checkStatus = this.multSelection[0]
          params.vmId = checkStatus.vmId;
          params.faIp = checkStatus.faIp;
          params.siteId = checkStatus.siteId;
          this.text = '正在重启虚机, 请稍后...'
          this.loadingState = true;
          httpAjax('desktop/reStart', params).then(res => {
            this.loadingState = false;
            if (res.resultCode == '0') {
              this.$message.success('启动需要一定的时间，请耐心等待!')
              // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     this.multSelection = [{disk:0}]
              //     this.getVmList()
              //     // this.$message({
              //     //   type: 'info',
              //     //   message: `action: ${ action }`
              //     // });
              //   }
              // });
              // layer.alert('请通知管理员配置UNS连接地址!', {
              //     icon: 5
              // });
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc
              });
            }
            this.multSelection = [{
              disk: 0
            }]
            this.getVmList()
          }).catch(() => {
            this.loadingState = false;
          })
        }).catch(() => {

        })

      },
      detach() { //清退 周一
        this.$confirm('确定要清退该桌面?', '清退桌面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingState = true;
          let params = {};
          let checkStatus = this.multSelection[0]
          params.computerName = checkStatus.computerName;
          params.faIp = checkStatus.faIp;
          params.vmId = checkStatus.vmId;
          params.siteId = checkStatus.siteId;
          this.text = '正在执行清退, 请稍后...'
          httpAjax('desktop/detach', params).then(res => {
            this.loadingState = false;
            if (res.resultCode == "0") {
              this.$message({
                type: 'success',
                message: '清退成功!'
              });
              //   this.$alert('请在我的订单中查看审批结果!', '清退桌面', {
              //     confirmButtonText: '确定',
              //     type: 'success',
              //     callback: action => {
              // this.multSelection = [{disk:0}]
              // this.getVmList()
              //     }
              //   });
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc //'已经清退,请勿重复操作!'
              });
              // this.multSelection = [{disk:0}]
              // this.$alert('已经提交过，正在审核中!', '清退桌面', {
              //   confirmButtonText: '确定',
              //   callback: action => {
              //   }
              // });
            }
            this.multSelection = [{
              disk: 0
            }]
            this.getVmList()
          }).catch(() => {
            this.loadingState = false;
          })
        }).catch(() => { //取消

        })
      },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      exportData() {
        window.open('/dcp/desktop/adminExport')
      },
      loginCloud() {
        var params = {
          name: sessionStorage.getItem('username'),
          initialPassword: sessionStorage.getItem('password'),
          tenantDomain: sessionStorage.getItem('domain')
        }
        httpAjax('user/unsLogin', params).then(res => {
          if (res.noLink) {
            this.$message.error('请通知管理员配置UNS连接地址!');
          } else {
            window.open(res.link + "/servlet/TokenLoginServlet?tokenId=" + res.tokenId);
          }
        })
      },
      checkDisable(type) {
        if (type === 'start') {
          return this.multSelection[0].runState === 'stopped'
        } else if (type === 'restart'||type==='stop') {
          return this.multSelection[0].runState === 'running'
        } else if (type === 'quit') {
          return this.multSelection[0].id && this.multSelection[0].runState !== 'deleted'
        } else if (type === 'edit') {
          return this.multSelection[0].deskType === 'copyClone'
        }
      },
      // handleSelectionChange(val) {
      //   },
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
        if (state == 'ATTACHED') {
          return '已分配'
        } else if (state == 'ATTACHING') {
          return '分配中'
        } else if (state == 'UNATTACH') {
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
        this.multSelection = [{
          disk: 0
        }]
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          user: this.applyUser,
          computerName: this.applyTable,
          runState: this.applyState,
          loginState: this.applyLoginState
        }
        const url = `desktop/adminResMonitor?${Math.random()}&online=1`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data;
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap', false)
          })
          this.getStatistics()
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChange(val) {
        this.multSelection = [{
          disk: 0
        }]
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.multSelection = [{
          disk: 0
        }]
        this.currentSize = val;
        this.getVmList()
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
      getStatistics() {
        const url = 'desktop/adminStatistics?online=1'
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
      setScrollBar(dom, bool) {
        // if (this.tableData.length) {
        addScrollBar(dom, bool)
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
<style>
#adminOnline .iconfont{
      font-size: 12px;
      margin-right: 5px;
  }
</style>

