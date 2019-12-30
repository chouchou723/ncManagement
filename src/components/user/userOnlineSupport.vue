<template>
  <div id="userOnlineSupport">
    <div class="search-wrap">
      <el-input placeholder="请输入故障名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择状态" clearable v-model="applyState" @keyup.enter.native="clearData"
        @change="clearData(1)">
        <el-option value="wait" label="未处理">
          未处理</el-option>
           <el-option value="processing" label="处理中">
          处理中</el-option>
        <el-option value="processed" label="已处理">
          已处理</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px;" v-if="localRole==='user'" @click="updateDesk">
        提交故障</el-button>
      <el-button type="text"
        style="float:right;margin-right:10px;color:#ef3152;font-size:18px;text-decoration:underline;">热线电话:{{telphone}}
      </el-button>

    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="title" label="故障单">
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#409eff;padding:9px 0" @click="openDetail(scope.row)">
              {{scope.row.title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="processor" label="状态">
          <template slot-scope="scope">
            <div
              :style="scope.row.status==='processed'?'color:#42b983':scope.row.status==='processing'?'':'color:#f10000'">
              {{scope.row.status==='processing'?'处理中':scope.row.status==='processed'?'已处理':'未处理'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="processor" label="处理人">
        </el-table-column>
        <el-table-column prop="creator" label="提交人">
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间">
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column prop="distanceTime" label="服务支持水平">
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
    <!-- 提交故障 -->
    <el-dialog title="提交故障" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' width="40%" @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="报修标题：" :label-width="formLabelWidth" prop="title">
          <el-input v-model="aform.title" placeholder='请输入报修标题' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <el-form-item label="优先级：" :label-width="formLabelWidth" prop="priority">
          <el-select style="width:190px;" placeholder="请选择优先级" v-model="aform.priority">
            <el-option value="high" label="高">高</el-option>
            <el-option value="middle" label="中">中</el-option>
            <el-option value="low" label="低">低</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望解决时间：" :label-width="formLabelWidth" prop="resolvedTime">
          <el-date-picker v-model="aform.resolvedTime" value-format="yyyy-MM-dd HH:mm:ss" type="date"
            placeholder="请选择期望解决时间" :editable="no" :clearable="no" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="问题描述：" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="aform.description" :autosize="{minRows: 6, maxRows: 6 }"
            placeholder='请输入描述,最多255个字' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <!-- <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3"
            :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="上传文件：" :label-width="formLabelWidth" prop="serverCert">
          <el-upload class="upload-demo" action="/dcp/uploader/upload" accept="file" ref="serverCert"
            :on-success="handlesuccess" :data="{type:'repair',foreignId:aform.id}" :on-remove="handleRemoveS"
            :on-error="handleErrorS" :auto-upload="false" :on-change="handleChangeS" :file-list="fileListS">
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 故障详情 -->
    <el-dialog title="故障详情" :visible.sync="dialogFormVisibleSyn" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' width="50%" @close="resetD('detailSupport')">
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar">
        <el-form :model="detailSupport" :rules="rulesS" ref="detailSupport">
          <el-form-item label="报修标题:" :label-width="formLabelWidth">
            <div>{{detailSupport.title}}</div>
          </el-form-item>
          <el-form-item label="优先级:" :label-width="formLabelWidth">
            <div>{{detailSupport.priorityStr}}</div>
          </el-form-item>
          <el-form-item label="期望解决时间:" :label-width="formLabelWidth">
            <div>{{detailSupport.resolvedTimeStr}}</div>
          </el-form-item>
          <el-form-item label="处理人:" :label-width="formLabelWidth"
            v-if="(localRole==='admin'||localRole==='tenant')&&detailSupport.status==='wait'" prop="processor">
            <div>
              <el-input style="width:180px;" v-model="detailSupport.processor" placeholder="请指派处理人" readonly="" />
              <el-button type="ghost" @click="queryUserList"><i class="el-icon-search"></i>查询</el-button>
            </div>
          </el-form-item>
          <el-form-item label="处理人:" :label-width="formLabelWidth"
            v-else>
            <div>{{detailSupport.processor||'暂无'}}</div>
          </el-form-item>
          <el-form-item label="问题描述:" :label-width="formLabelWidth" prop="fa">
            <div>{{detailSupport.description}}</div>
          </el-form-item>
          <el-form-item label="问题附件:" :label-width="formLabelWidth" prop="uploadFiles">
            <el-button type="text" @click="getFile" v-if="detailSupport.uploadFiles[0]">
              {{detailSupport.uploadFiles[0].name}}</el-button>
            <div v-else>暂无</div>
          </el-form-item>
          <el-form-item label="解决方案:" :label-width="formLabelWidth" prop="resolution"
            v-if="detailSupport.processor===localName&&detailSupport.status==='processing'">
            <el-input type="textarea" v-model="detailSupport.resolution" :autosize="{minRows: 6, maxRows: 6 }"
              placeholder='请输入解决方案,最多255个字' :style='{width:"400px"}'>
            </el-input>
          </el-form-item>
          <el-form-item label="解决方案:" :label-width="formLabelWidth"
            v-else>
            <div>{{detailSupport.resolution||'暂无'}}</div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addResolution('detailSupport')"
          v-if="(detailSupport.status==='wait'&&localRole==='troubleshooting')||(detailSupport.status==='processing'&&detailSupport.processor===localName)">
          {{detailSupport.status==='processing'?'提 交':'接 收'}}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addResolution('detailSupport')"
          v-if="detailSupport.status==='wait'&&(localRole==='admin'||localRole==='tenant')">提 交</el-button>
        <el-button @click="dialogFormVisibleSyn = false"
          v-if="(detailSupport.status==='wait'&&(localRole==='admin'||localRole==='tenant'))||((detailSupport.status==='wait'&&localRole==='troubleshooting')||(detailSupport.status==='processing'&&detailSupport.processor===localName))">
          取 消</el-button>
      </div>
    </el-dialog>
    <!-- 处理人  -->
    <el-dialog title="选择处理人" :visible.sync="modalState1" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='8%' @close='resetD("b")'>
      <h4 slot="header">选择处理人</h4>
      <div class="search-wrap">
        <el-input placeholder="请输入处理人名称" v-model="queryUserName" style="width:185px;" clearable
          @keyup.enter.native="queryUserList('',1)" @clear="queryUserList('',1)" />
        <el-button type="ghost" @click="queryUserList('',1)"><i class="el-icon-search"></i>查询</el-button>
        <!-- <el-button type="primary" @click="serviceConfirm">确定</el-button> -->
      </div>
      <div class="table-wrap" id="table-wrap">
        <el-table :data="userListData" height="260" ref="multipleTable" stripe
          :header-cell-style="{'text-align':'center'}" @select="checkSelect" @row-click="rowClickSys"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="处理人">
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListData.length" style="margin-right:0;text-align:center">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="count1">
        </el-pagination>
        <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="serviceConfirm" :disabled="this.tableChecked.length==0">确 定</el-button>
        <el-button @click="modalState1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <div>
      <beautiful-chat :participants="participants" :titleImageUrl="titleImageUrl" :onMessageWasSent="onMessageWasSent"
        :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :close="closeChat"
        :open="openChat" :showEmoji="true" :showFile="true" :showTypingIndicator="showTypingIndicator" :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom" :messageStyling="messageStyling" />
      <el-dialog title="图片详情" :visible.sync="diaPic" top='7%' width="40%" @close="$store.commit('getImg','')">
        <img :src="$store.state.getImg" alt="" style="width:100%">
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
  import {
    httpAjax,
    httpGet,
    computedTableHeight,
    addScrollBar
  } from 'api/common'
  //   import beautifulChat from '../common/vueBeautifulChat/src/Launcher'
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
        telphone: '',
        fileListS: [],
        queryUserName: '',
        tableChecked: [],
        count1: 0,
        currentPage5: 1,
        currentSize1: 10,
        userListData: [],
        modalState1: false,
        // participants: [{
        //     id: 'user1',
        //     name: 'Matteo',
        //     imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        //   },
        // //   {
        // //     id: 'user2',
        // //     name: 'Support',
        // //     imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        // //   }
        // ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
        // titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
        // messageList: [{
        //     type: 'text',
        //     author: `me`,
        //     data: {
        //       text: `Say yes!`
        //     }
        //   },
        //   {
        //     type: 'text',
        //     author: `user1`,
        //     data: {
        //       text: `No.`
        //     }
        //   }
        // ], // the list of the messages to show, can be paginated and adjusted dynamically
        // newMessagesCount: 10,
        // isChatOpen: false, // to determine whether the chat window should be open or closed
        // showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
        // colors: {
        //   header: {
        //     bg: '#4e8cff',
        //     text: '#ffffff'
        //   },
        //   launcher: {
        //     bg: '#4e8cff'
        //   },
        //   messageList: {
        //     bg: '#ffffff'
        //   },
        //   sentMessage: {
        //     bg: '#4e8cff',
        //     text: '#ffffff'
        //   },
        //   receivedMessage: {
        //     bg: '#eaeaea',
        //     text: '#222222'
        //   },
        //   userInput: {
        //     bg: '#f4f7f9',
        //     text: '#565867'
        //   }
        // }, // specifies the color scheme for the component
        // alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
        // messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattmezza/msgdown)
        btnLoading: false,
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
          title: '',
          priority: '',
          resolvedTime: '',
          description: '',
          serverCert: '',
        },
        rules2: {
          title: [{
            required: true,
            message: '请输入报修标题',
            // validator: nan16,
            trigger: 'blur'
          }],
          priority: [{
            required: true,
            message: '请选择优先级',
            // validator: nan32,
            trigger: 'change'
          }],
          resolvedTime: [{
            required: true,
            message: '请输入期望解决日期',
            // validator: nan16,
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入问题描述',
            // validator: blow255,
            trigger: 'blur'
          }]
        },
        rulesS: {
          resolution: [{
            required: true,
            message: '请输入解决方案',
            // validator: nan16,
            trigger: 'blur'
          }],
          processor: [{
            required: true,
            message: '请指派处理人',
            // validator: nan32,
            trigger: 'blur'
          }],
        },
        formLabelWidth: '130px',
        inputLabelWidth: '300px',
        dialogFormVisibleP: false,
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < Date.now()- 8.64e7;
          }
        },
        dialogFormVisibleSyn: false,
        detailSupport: {
          processor: '',
          resolution: '',
          uploadFiles: [{
            name: '点击查看'
          }]
        },
        temp: '',
        backDetail: '',
      }
    },
    // components: {
    //   beautifulChat
    // },
    created() {
      this.getVmList(1)
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    computed: {

      diaPic() {
        return this.$store.state.getImg !== ''
      },
      localRole() {
        return sessionStorage.getItem('role')
      },
      localName() {
        return sessionStorage.getItem('username')
      }
    },
    methods: {
      handlesuccess(response, file, fileList) {
        if (response.id) {
          this.btnLoading = false;
          this.getVmList();
          this.dialogFormVisible = false;
        }
      },
      getFile() {
        window.open(`/dcp/${this.detailSupport.uploadFiles[0].path}`)
      },
      handleErrorS(response, file, fileList) {
        this.$message.error('通信错误');
        this.btnLoading = false;
        this.dialogFormVisible = false;
      },
      handleRemoveS(file, fileList) {
        this.aform.serverCert = ''
        // }
      },
      handleChangeS(file, fileList) {
        if (file.size <= 5 * 1024 * 1024) {
          this.fileListS = fileList.slice(-1);
          this.aform.serverCert = 'upload';
        } else {
          if (this.fileListS.length === 1) {
            this.fileListS = fileList.slice(0, 1);
          } else {
            this.fileListS = [];
          }
          this.$message.error('文件最大不能超过5MB!');
        }
      },
      handleCurrentChange1(val) {
        this.tableChecked = [];
        this.currentPage5 = val;
        this.queryUserList()
      },
      handleSizeChange1(val) {
        this.tableChecked = [];
        this.currentSize1 = val;
        this.queryUserList()
      },
      addResolution(formName) { //处理故障
        if (this.detailSupport.status === 'processing') {
          this.$refs[formName].validate((valid) => {
            let para = {
              id: this.detailSupport.id,
              processor: this.detailSupport.processor,
              resolution: this.detailSupport.resolution
            }
            if (valid&&this.detailSupport.resolution) {
              this.btnLoading = true;
              httpAjax('helpContent/resolveRepairs', para).then(res => {
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
                this.dialogFormVisibleSyn = false;
                this.btnLoading = false;
              }).catch(() => {
                this.btnLoading = false;
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        } else { //接收,指派
        // if(this.localRole==='troubleshooting'){
        //     this.detailSupport.processor = this.localName
        // }
          this.$refs[formName].validate((valid) => {
            let para = {
              id: this.detailSupport.id,
              processor: this.localRole==='troubleshooting'?this.localName:this.detailSupport.processor,
            }
            console.log(valid)
            if (valid) {
              this.btnLoading = true;
              httpAjax('helpContent/updateRepairs', para).then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: this.detailSupport.processor?'指派成功!':'接收成功'
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
                    message: this.detailSupport.processor?'指派失败!':'接收失败'
                  });
                }
                this.getVmList()
                this.dialogFormVisibleSyn = false;
                this.btnLoading = false;
              }).catch(() => {
                this.btnLoading = false;
              })
            }


          })
        }
      },
      serviceConfirm() { //确认处理人
        console.log(this.tableChecked[0].name)
        this.detailSupport.processor = this.tableChecked[0].name;
        this.modalState1 = false;
        this.tableChecked = [];
        this.$refs.detailSupport.validateField('processor')

      },
      rowClickSys(row, column, event) {
        if (this.tableChecked.length > 0 && this.tableChecked[0].id !== row.id) {
          this.$refs.multipleTable.toggleRowSelection(this.tableChecked[0]);
          this.tableChecked = [row];
        } else if (this.tableChecked.length > 0 && this.tableChecked[0].id === row.id) {
          this.tableChecked = [];
        } else {
          this.tableChecked = [row];
        }
        this.$refs.multipleTable.toggleRowSelection(row);

      },
      checkSelect(selection, row) {
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.tableChecked = selection;
        // console.log(selection, row)
      },
      queryUserList(first, page) {
        // var page = typeof num == 'number' ? num : 1;
        page ? this.currentPage5 = page : '';
        var params = {
          name: this.queryUserName,
          page: this.currentPage5,
          limit: this.currentSize1,
          role: 'troubleshooting'
        }
        let url = `user/userList`
        this.modalState1 = true
        httpAjax(url, params).then((res) => {
          this.userListData = res.data
          this.count1 = res.count
          this.$nextTick(() => {
            this.setScroll('#table-wrap', true)
          })
        }).catch((err) => {
          console.log(err)
        })
      },
    //   sendMessage(text) {
    //     console.log(text)
    //     if (text.length > 0) {
    //       this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
    //       this.onMessageWasSent({
    //         author: 'support',
    //         type: 'text',
    //         data: {
    //           text
    //         }
    //       })
    //     }
    //   },
    //   onMessageWasSent(message) {
    //     console.log(message)
    //     let file = message.data.file
    //     if (file && (file.type.indexOf('image') > -1)) {
    //       message.data.file.url = window.URL.createObjectURL(message.data.file);
    //     }
    //     //  let reader = new FileReader();
    //     //   reader.onload = (e) => {
    //     this.messageList = [...this.messageList, message, {
    //       type: 'text',
    //       author: `user1`,
    //       data: {
    //         text: `No.`
    //       }
    //     }]
    //     // };
    //     // reader.readAsDataURL(message.data.file);
    //     // called when the user sends a message
    //   },
    //   createFile(msg) {
    //     this.fileUploaded = false;
    //     let reader = new FileReader();
    //     let vm = this;
    //     reader.onload = (e) => {
    //       msg.data.file.url = e.target.result;
    //       vm.fileUploaded = true;
    //     };
    //     reader.readAsDataURL(msg.data.file);
    //   },
    //   openChat() {
    //     // called when the user clicks on the fab button to open the chat
    //     this.isChatOpen = true
    //     this.newMessagesCount = 0
    //   },
    //   closeChat() {
    //     // called when the user clicks on the botton to close the chat
    //     this.isChatOpen = false
    //   },
      updateDesk() {
        this.dialogFormVisible = true;
      },
      openDetail(data) {
        this.detailSupport = {
          ...data
        }
        // this.backDetail = (this.localRole === 'user' || this.localRole === 'asset' || data.creator === this.localName ||
        //   data.processor)
        // console.log(this.backDetail)
        this.dialogFormVisibleSyn = true;
      },

      resetD(formName) {
        switch (formName) {
          case 'aform':
            this.aform = {
              id: '',
              title: '',
              priority: '',
              resolvedTime: '',
              description: '',
              serverCert: '',
            }
            this.fileListS = [];
            this.$refs['aform'].resetFields();
            break;
          case 'detailSupport':
            this.detailSupport = {
              id: '',
              processor: '',
              resolution: '',
              uploadFiles: [{
                name: '点击查看'
              }]
            }
            this.$refs['detailSupport'].resetFields();
            this.$refs['myScrollbar'].wrap.scrollTop = 0;
            break;
          case 'b':
            this.$refs.multipleTable.toggleRowSelection(this.tableChecked[0]);
            this.tableChecked = [];
            this.queryUserName = '';
            this.currentPage5 = 1;
            this.currentSize1 = 10;
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
            httpAjax('helpContent/saveRepairs', f).then(res => {
              if (res) {
                this.aform.id = res.id
                setTimeout(() => {
                  if (this.aform.serverCert == 'upload') {
                    this.$refs.serverCert.submit();
                  } else {
                    this.dialogFormVisible = false;
                    this.getVmList();
                    this.btnLoading = false;
                  }
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
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
      getTelphone() { //获取热线
        const url = `system/getTelephone?${Math.random()}`
        httpGet(url).then((res) => {
          //   console.log(res)
          this.telphone = res.telephone || 123123;
        }).catch((error) => {
          console.log(error)
        })
      },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          title: this.applyUser,
          status: this.applyState,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `helpContent/repairsList?${Math.random()}&online=1`
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
        this.getTelphone()
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
    height: calc(70vh - 120px);
  }

</style>
