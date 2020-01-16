<template>
  <div id="userOnlineSupport">
    <div class="search-wrap">
      <el-input placeholder="请输入FA名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
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
        <el-table-column prop="faName" label="FusionAccess名称">
        </el-table-column>
        <el-table-column prop="faIP" label="主FA IP">
        </el-table-column>
        <el-table-column prop="faBackupIp" label="备FA IP">
        </el-table-column>
        <el-table-column prop="virtualNum" label="虚机数">
        </el-table-column>
        <!-- <el-table-column prop="memory" label="内存">
        </el-table-column>
        <el-table-column prop="disk" label="用户盘">
        </el-table-column> -->
        <el-table-column prop="description" label="备注">
        </el-table-column>
        <!-- <el-table-column prop="noticeContent" label="内容">
                <template slot-scope="scope">
                    <div style="text-align:left;">
            {{(scope.row.noticeContent)}}
                    </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" >
              <template slot-scope="scope">
              {{new Date(scope.row.createTime).toLocaleString()}}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0">修改</el-button>
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
    <el-dialog :title="faId?'修改FusionAccess':'新增FusionAccess'" :visible.sync="dialogFormVisible"
      :close-on-click-modal="no" custom-class='accountManageDialog' top='3%' @close='resetD("aform")' width="50%">
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar">
        <el-form :model="aform" :rules="rules2" ref="aform">
          <el-form-item label="FusionAccess名称：" :label-width="formLabelWidth" prop="faName">
            <el-input v-model="aform.faName" placeholder='请输入FusionAccess名称' :style='{width:inputLabelWidth}'>
            </el-input>
          </el-form-item>
          <el-form-item label="主FusionAccess IP：" :label-width="formLabelWidth" prop="faIP">
            <el-input v-model="aform.faIP" placeholder='请输入IP地址' :style='{width:inputLabelWidth}' :readonly="faId!==''">
            </el-input>
          </el-form-item>
          <el-form-item label="备FusionAccess IP：" :label-width="formLabelWidth" prop="faBackupIp">
            <el-input v-model="aform.faBackupIp" placeholder='请输入备用IP地址' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>

          <el-form-item label="用户名：" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="aform.userName" placeholder='请输入用户名' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
            <el-input v-model="aform.password" placeholder='请输入密码' :style='{width:inputLabelWidth}' type="password"
              autocomplete="new-password">
            </el-input>
          </el-form-item>
          <el-form-item label="客户端证书：" :label-width="formLabelWidth" prop="clientCert">
            <el-upload class="upload-demo" action="/api/system/uploadCerti" accept="file" ref="clientCert"
              :data="{type:'client',id:aform.id,faIP:aform.faIP}" :on-remove="handleRemove" :on-success="handlesuccess"
              :on-error="handleError" :before-upload="beforeUpload" :auto-upload="false" :on-change="handleChange"
              :file-list="fileList">
              <el-button type="primary"><i class="el-icon-upload" style="margin-right:5px"></i>上传证书文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="客户端证书密码：" :label-width="formLabelWidth" prop="clientCertPassword">
            <el-input v-model="aform.clientCertPassword" placeholder='请输入客户端证书密码' :style='{width:inputLabelWidth}'
              type="password" autocomplete="new-password">
            </el-input>
          </el-form-item>
          <el-form-item label="服务器端证书：" :label-width="formLabelWidth" prop="serverCert">
            <el-upload class="upload-demo" action="/api/system/uploadCerti" accept="file" ref="serverCert"
              :data="{type:'server',id:aform.id,faIP:aform.faIP}" :on-remove="handleRemoveS"
              :on-success="handlesuccessS" :on-error="handleErrorS" :before-upload="beforeUploadS" :auto-upload="false"
              :on-change="handleChangeS" :file-list="fileListS">
              <el-button type="primary"><i class="el-icon-upload" style="margin-right:5px"></i>上传证书文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="服务器端证书密码：" :label-width="formLabelWidth" prop="serverCertPassword">
            <el-input v-model="aform.serverCertPassword" placeholder='请输入服务器端证书密码' :style='{width:inputLabelWidth}'
              type="password" autocomplete="new-password">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="CPU：" :label-width="formLabelWidth" prop="cpu">
            <el-input-number v-model="aform.cpu" controls-position="right" :min="1" :style='{width:inputLabelWidth}'>
            </el-input-number>
          </el-form-item>
          <el-form-item label="内存：" :label-width="formLabelWidth" prop="memory">
            <el-input-number v-model="aform.memory" controls-position="right" :min="1" :style='{width:inputLabelWidth}'>
            </el-input-number>
          </el-form-item>
          <el-form-item label="磁盘：" :label-width="formLabelWidth" prop="disk">
            <el-input-number v-model="aform.disk" controls-position="right" :min="1" :style='{width:inputLabelWidth}'>
            </el-input-number>
          </el-form-item> -->
          <el-form-item label="虚机数：" :label-width="formLabelWidth" prop="virtualNum">
            <el-input-number v-model="aform.virtualNum" controls-position="right" :min="1"
              :style='{width:inputLabelWidth}'>
            </el-input-number>
             <div style="color:#f10000">
              (该FA下发放的最大商品数为{{aform.virtualNum}}台)
            </div>
            <!-- <el-input v-model="aform.virtualNum" placeholder='请输入虚机数' :style='{width:inputLabelWidth}'></el-input> -->
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth" prop="description">
            <el-input v-model="aform.description" placeholder='请输入备注' :style='{width:inputLabelWidth}'>
            </el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 故障详情 -->
    <el-dialog title="故障详情" :visible.sync="dialogFormVisibleSyn" custom-class='accountManageDialog' top='7%'
      width="40%">
      <el-form ref="sform">
        <el-form-item label="报修标题:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.title}}</div>
        </el-form-item>
        <el-form-item label="优先级:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.priorityStr}}</div>
        </el-form-item>
        <el-form-item label="期望解决时间:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.resolvedTimeStr}}</div>
        </el-form-item>
        <el-form-item label="处理人:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.processor||'暂无'}}</div>
        </el-form-item>
        <el-form-item label="问题描述:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.description}}</div>
        </el-form-item>
        <!-- <el-form-item label="问题附件:" :label-width="formLabelWidth" prop="fa">
          <div>{{sform.title}}</div>
        </el-form-item> -->
        <el-form-item label="解决方案:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.resolution||'暂无'}}</div>
        </el-form-item>
      </el-form>
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
      var nan32 = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value)) {
          callback('请按规范输入 IP 地址, 例如: 192.168.3.5')
        } else if (value & this.faId === '') {
          let url = 'system/validateIP'
          httpAjax(url, {
            faIP: value,
            id: this.faId
          }).then(res => {
            if (res.result == 1) {
              callback('IP地址重复')
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
      var nanBack = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (value && !reg.test(value)) {
          callback('请按规范输入 IP 地址, 例如: 192.168.3.5')
        } else {
          callback()
        }
      }
      return {
        faId: '',
        autoUpload: true,
        btnLoading: false,
        btnLoadingD: false,
        btnIndex: '',
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
        selectRowData: [],
        applyUser: '',
        applyTable: '',
        applyState: '',
        applyLoginState: '',
        loadingState: false,
        text: '请稍后',
        dialogFormVisible: false,
        aform: {
          id: '',
          faName: '',
          faIP: '',
          faBackupIp: '',
          userName: '',
          password: '',
          clientCert: '',
          serverCert: '',
          clientCertPassword: '',
          serverCertPassword: '',
          cpu: '',
          memory: '',
          disk: '',
          virtualNum: '',
          description: ''
        },
        rules2: {
          faName: [{
            required: true,
            message: '请输入FA名称',
            // validator: nan16,
            trigger: 'blur'
          }],
          faIP: [{
            required: true,
            validator: nan32,
            trigger: 'blur'
          }],
          faBackupIp: [{
            validator: nanBack,
            trigger: 'blur'
          }],
          userName: [{
            required: true,
            message: '请输入用户名',
            // validator: nan16,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            // validator: nan16,
            trigger: 'blur'
          }],
          clientCert: [{
            required: true,
            message: '请上传客户端证书',
            // validator: nan16,
            trigger: 'blur'
          }],
          serverCert: [{
            required: true,
            message: '请上传服务器端证书',
            // validator: nan16,
            trigger: 'blur'
          }],
          clientCertPassword: [{
            required: true,
            message: '请输入客户端证书密码',
            // validator: nan16,
            trigger: 'blur'
          }],
          serverCertPassword: [{
            required: true,
            message: '请输入服务器端证书密码',
            // validator: nan16,
            trigger: 'blur'
          }],
          cpu: [{
            required: true,
            message: '请输入CPU数',
            // validator: nan16,
            trigger: 'blur'
          }],
          memory: [{
            required: true,
            message: '请输入内存数',
            // validator: nan16,
            trigger: 'blur'
          }],
          disk: [{
            required: true,
            message: '请输入磁盘数',
            // validator: nan16,
            trigger: 'blur'
          }],
          virtualNum: [{
            required: true,
            message: '请输入虚机数',
            // validator: blow255,
            trigger: 'blur'
          }]
        },
        formLabelWidth: '180px',
        inputLabelWidth: '300px',
        dialogFormVisibleP: false,
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        dialogFormVisibleSyn: false,
        detailSupport: {},
        fileList: [],
        fileListS: [],
        sysRes: '',
        clientRes: ''
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
      beforeUpload(file, fileList) { //文件判断
        // console.log(file.name.split('.').slice(-1))
        // const isLic = file.name.split('.').slice(-1)[0] === 'p12';
        // //     const isLt2M = file.size / 1024 / 1024 < 5;
        // if (!isLic) {
        //   this.$message.error('必须上传p12文件!');
        //   return false;
        // }
      },
      handleChange(file, fileList) {
        if (file.name.split('.').slice(-1)[0] === 'p12') {
          this.fileList = fileList.slice(-1);
          this.aform.clientCert = 'upload'
          this.$refs.aform.validateField('clientCert');
        } else {
          if (this.fileList.length === 1) {
            this.fileList = fileList.slice(0, 1);
          } else {
            this.aform.clientCert = '';
            this.fileList = [];
          }
          this.$refs.aform.validateField('clientCert')
          this.$message.error('必须上传p12文件!');
        }
      },
      handlesuccess(response, file, fileList) {
        this.clientRes = response.success;
        if (this.clientRes === 'success' && this.sysRes === 'success') {
          this.btnLoading = false;
          this.getVmList()
          this.dialogFormVisible = false;
        }
        // this.aform.clientCert = 'upload'
        // this.$refs.aform.validateField('clientCert')
      },
      handleError() {
        this.$message.error('通信错误');
        this.btnLoading = false;
        this.dialogFormVisible = false;
      },
      handleRemove(file, fileList) {
        //   console.log(fileList)
        // if (fileList.length !== 1) {
        this.aform.clientCert = ''
        this.$refs.aform.validateField('clientCert')
        // }
      },
      beforeUploadS(file, fileList) { //文件判断
        // const isLic = file.name.split('.').slice(-1)[0] === 'keystore';
        // //     const isLt2M = file.size / 1024 / 1024 < 5;
        // if (!isLic) {
        //   this.$message.error('必须上传keystore文件!');
        //   return false;
        // }
      },
      handleChangeS(file, fileList) {
        if (file.name.split('.').slice(-1)[0] === 'keystore') {
          this.fileListS = fileList.slice(-1);
          this.aform.serverCert = 'upload'
          this.$refs.aform.validateField('serverCert');
        } else {
          if (this.fileListS.length === 1) {
            this.fileListS = fileList.slice(0, 1);
          } else {
            this.aform.serverCert = '';
            this.fileListS = [];
          }
          this.$refs.aform.validateField('serverCert')
          this.$message.error('必须上传keystore文件!');
        }
      },
      handlesuccessS(response, file, fileList) {
        this.sysRes = response.success;
        if (this.clientRes === 'success' && this.sysRes === 'success') {
          this.btnLoading = false;
          this.dialogFormVisible = false;
          this.getVmList()
        }
        // this.aform.serverCert = 'upload'
        // this.$refs.aform.validateField('serverCert');
        // this.autoUpload = false;
      },
      handleErrorS() {
        this.$message.error('通信错误');
        this.btnLoading = false;
        this.dialogFormVisible = false;
      },
      handleRemoveS(file, fileList) {
        // if (fileList.length !== 1) {
        this.aform.serverCert = ''
        this.$refs.aform.validateField('serverCert')
        // }
      },
      updateDesk() { //点击新增
        this.dialogFormVisible = true;
      },
      editCate(data) {
        this.faId = data.id
        let params = {
          id: data.id
        }
        httpAjax('system/getFaInfo', params).then(res => {
          if (res) {
            this.aform = {
              id: res.id,
              faName: res.faName,
              faIP: res.faIP,
              faBackupIp: res.faBackupIp,
              userName: res.userName,
              password: res.password,
              clientCert: res.clientCertFile,
              serverCert: res.serverCertFile,
              clientCertPassword: res.clientCertPassword,
              serverCertPassword: res.serverCertPassword,
              cpu: res.cpu,
              memory: res.memory,
              disk: res.disk,
              virtualNum: res.virtualNum - 0,
              description: res.resultDescription
            }
            if (res.clientCertFile) {
              this.clientRes = 'success'
            }
            if (res.serverCertFile) {
              this.sysRes = 'success'
            }
            this.dialogFormVisible = true;
          }
        }).catch(() => {})
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
          httpAjax('system/delete', params).then(res => {
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
        }).catch(() => {

        })


      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            this.aform = {
              id: '',
              faName: '',
              faIP: '',
              faBackupIp: '',
              userName: '',
              password: '',
              clientCert: '',
              serverCert: '',
              clientCertPassword: '',
              serverCertPassword: '',
              cpu: '',
              memory: '',
              disk: '',
              virtualNum: '',
              description: ''
            }
            this.fileList = [];
            this.fileListS = [];
            this.clientRes = '';
            this.sysRes = '';
            this.faId = '';
            this.$refs['myScrollbar'].wrap.scrollTop = 0;
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
          if (valid) {
            this.btnLoading = true;
            httpAjax('system/saveFaInfo', f).then(res => {
              if (res) {
                this.aform.id = res.id
                setTimeout(() => {
                  if (this.aform.serverCert == 'upload') {
                    this.$refs.serverCert.submit();
                  }
                  if (this.aform.clientCert == 'upload') {
                    this.$refs.clientCert.submit();
                  }
                  if (this.clientRes === 'success' && this.sysRes === 'success') {
                    this.btnLoading = false;
                    this.dialogFormVisible = false;
                    this.getVmList()
                  }
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  // this.dialogFormVisible = false;
                  // this.getVmList()
                }, 200)
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
                this.btnLoading = false;
              }
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
          faName: this.applyUser
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `system/faList?${Math.random()}`
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

  #menuList123 {
    height: calc(80vh - 130px);
  }

</style>
