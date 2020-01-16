<template>
  <div id="userListPage" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入用户名" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-select style="width:190px;" placeholder="请选择角色" clearable v-model="applyState" @keyup.enter.native="clearData"
        @change="clearData(3)">
        <el-option v-for="(item,index) in roleList" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <!-- <el-select style="width:190px;" placeholder="请选择角色" clearable v-model="applyState" @keyup.enter.native="clearData"
        @change="clearData(3)">
        <el-option v-for="(item,index) in roleList" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
      <el-select style="width:190px;" placeholder="请选择标签" clearable v-model="tagState" @keyup.enter.native="clearData"
        @change="clearData(3)">
        <el-option v-for="(item,index) in tagListSelect" :key="index" :value="item.value" :label="item.label">
          {{item.label}}</el-option>
      </el-select>
        <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader> -->
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <!-- <el-button type="primary"
       style="float:right;margin-right:10px;"   @click="exportData" >导出</el-button>
    -->
    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <!-- <div class="newBtnWrap">
        <el-button-group>

          <el-button size="small" type="primary" @click="openTag" icon="el-icon-star-on"
            :disabled="multSelection.length===0">添加标签</el-button>
          <el-button size="small" type="primary" @click="sendMessage" icon="el-icon-edit-outline"
            :disabled="multSelection.length===0">发送消息</el-button>
          <el-button size="small" type="danger" @click="openMsgList" icon="el-icon-document">消息记录</el-button>
        </el-button-group>
        <el-button-group style="float:right;margin-top: 10px;margin-right: 10px;">

          <el-button size="small" type="primary" @click="exportData" icon="el-icon-download">导出
          </el-button>
           <el-button icon="el-icon-refresh" size="small" type="primary" @click="refreshData">同步用户
          </el-button>
        </el-button-group>
      </div> -->
        <!-- @row-click="rowClick" @selection-change="handleSelectionChangeMerge" -->
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" ref="multipleTable"
       stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <!-- <el-table-column prop="tag" label="标签" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.tags" :key="'tag'+index" :type="typeListS[item.tagId]" closable
              style="margin:5px 5px 5px 0;cursor:pointer" @click.native="checkTag(item)"
              @close='closeTag(scope.row,item)'>
              {{item.name}}
            </el-tag>

          </template>
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
        <el-table-column prop="role" label="角色" width="120">
          <template slot-scope="scope">
            {{ scope.row.role==='tenant'?'老师':'学员'}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ou" label="部门OU">
          <template slot-scope="scope">
        
            <el-tag type="info"  @click.native="checkTagOu(scope.row.ou)" style="cursor:pointer">
              {{scope.row.ou?scope.row.ou.split(',')[1].split('=')[1]:'暂无'}}
            </el-tag>

          </template>
        </el-table-column> -->

        <!-- <el-table-column label="" width="100">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0" v-if=" scope.row.role!=='asset'"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">
             修改</el-button>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="mail" label="自助配额" width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quota" @change="handleChange(scope.row.quota)" @click.native="setQuotaId(scope.row.id)" size="small" :min="scope.row.usedQuota?scope.row.usedQuota:1">
            </el-input-number>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="mail" label="邮箱">
        </el-table-column> -->
        <el-table-column prop="createTimeStr" label="创建时间">
        </el-table-column>
        <el-table-column prop="updateTimeStr" label="最近登录时间">
          <!-- <template slot-scope="scope">
              {{new Date(scope.row.createTime).toLocaleString()}}
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div style="line-height:20.5px;">
              <el-button @click="editCharacter(scope.row)" type="text" style="padding:0 0 4px 0">
                修改角色</el-button>
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
    <!-- 用户标签  -->
    <!-- <el-dialog title="用户标签" :visible.sync="transformForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='8%' @close='resetD("transformForm")'>
      <div style="float:right;margin-top:-30px;">
        <el-button type="primary" size="small" @click="addCate">创建标签</el-button>
      </div>
      <div class="table-wrap" id="table-wrapTran">
        <el-table :data="tagList" height="380" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClick1" @select="checkSelect1"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="标签">
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="editCate(scope.row)" type="text" style="padding:0"
                :loading="btnLoadingD&&(btnIndex===scope.row.id)">修改</el-button>
              <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
                :loading="btnLoadingD&&(btnIndex===scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="tagList.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="countTran">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="multSelectionTran.length===0"
          @click="confirmTagUser">确
          定</el-button>
        <el-button @click="transformForm = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 消息列表  -->
    <!-- <el-dialog title="消息记录" :visible.sync="dialogMessage" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='7%' @close='resetD("dialogMessage")' width="60%">
      <div class="search-wrap" style="margin-top:-10px;">
        <el-select style="width:190px;" placeholder="请选择状态" clearable v-model="sendState" @change="openMsgList">
          <el-option value="success" label="发送成功">发送成功</el-option>
          <el-option value="error" label="发送失败">发送失败</el-option>
        </el-select>
      </div>
      <div class="table-wrap" id="table-wrapMessage">
        <el-table :data="messageList" height="450" stripe :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
   
          <el-table-column prop="user" label="用户名">
          </el-table-column>
          <el-table-column prop="message" label="发送内容">
          </el-table-column>
          <el-table-column prop="createTimeStr" label="发送时间" width="160">
          </el-table-column>
          <el-table-column prop="result" label="发送状态" min-width="100">
            <template slot-scope="scope">
              <div :style="scope.row.result!=='success'?'color:#f10000':'color:#42b983'">
                {{scope.row.result==='success'?'发送成功':'发送失败!(失败原因:'+scope.row.description+')'}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="messageList.length" style="text-align: center;margin-right:0;margin-top:20px;">
        <el-pagination @current-change="handleCurrentChange2" @size-change="handleSizeChange2"
          :current-page="currentPage6" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize2"
          layout="total, sizes, prev, pager, next" :total="countMessage">
        </el-pagination>
      </div>
    </el-dialog> -->
    <!-- 点击标签发送消息  -->
    <!-- <el-dialog :title="`发送给标签为<${backTag.name}>的所有用户`" :visible.sync="messageForm" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='13%' @close='resetD("aform")'>
      <div>
        <el-form :model="aform" :rules="rules2" ref="aform">
          <el-form-item label="消息内容：" :label-width="formLabelWidth" prop="message">
            <el-input type="textarea" v-model="aform.message" :autosize="{minRows: 6, maxRows: 6 }"
              placeholder='请填写消息内容,最多255个字' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="!aform.message" @click="serviceConfirm('tag')">确
          定</el-button>
        <el-button @click="messageForm = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 点击部门发送消息  -->
    <!-- <el-dialog :title="`发送给部门为<${backTag}>的所有用户`" :visible.sync="messageFormOu" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='13%' @close='resetD("aform")'>
      <div>
        <el-form :model="aform" :rules="rules2" ref="aform">
          <el-form-item label="消息内容：" :label-width="formLabelWidth" prop="message">
            <el-input type="textarea" v-model="aform.message" :autosize="{minRows: 6, maxRows: 6 }"
              placeholder='请填写消息内容,最多255个字' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="!aform.message" @click="serviceConfirmOu('ou')">确
          定</el-button>
        <el-button @click="messageFormOu = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 指定用户发送消息  -->
    <!-- <el-dialog :title="mulUserTitle" :visible.sync="messageFormMul" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='13%' @close='resetD("aform")'>
      <div>
        <el-form :model="aform" :rules="rules2" ref="aform">
          <el-form-item label="消息内容：" :label-width="formLabelWidth" prop="message">
            <el-input type="textarea" v-model="aform.message" :autosize="{minRows: 6, maxRows: 6 }"
              placeholder='请填写消息内容,最多255个字' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="!aform.message" @click="serviceConfirm('user')">确
          定</el-button>
        <el-button @click="messageFormMul = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 修改角色  -->
    <el-dialog title="修改角色" :visible.sync="editRoleForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='13%' @close='resetD("rform")' width="40%">
      <div>
        <el-form :model="rform" ref="rform">
          <el-form-item label="选择角色：" :label-width="formLabelWidth" prop="role">
            <el-select style="width:190px;" placeholder="请选择角色" v-model="rform.role">
              <el-option v-for="(item,index) in roleList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="backData.role===rform.role" @click="addAccount">确
          定</el-button>
        <el-button @click="editRoleForm = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 资源转移  -->
    <!-- <el-dialog title="资源转移" :visible.sync="resourceForm" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='7%' @close='resetD("multipleTableTransfer")' width="45%">
      <div>
        <div style="color:#f10000;margin-top:-10px;margin-bottom:20px;">*转移后,云管理员<span
            style="font-weight:bold;font-size:20px;">
            <{{transferData.name}}>
          </span>的所有资源、商品配额,以及待审批事项都将转移给选中的云管理员</div>
        <div class="table-wrap" id="table-wrapTransfer">
          <el-table :data="transferList" height="380" ref="multipleTableTransfer" stripe
            :header-cell-style="{'text-align':'center'}" @row-click="rowClick2" @select="checkSelect2"
            :cell-style="{'text-align':'center'}">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" label="用户名">
              <template slot-scope="scope">
                <div>
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="domainUserName" label="域用户">
            </el-table-column>
            <el-table-column prop="ou" label="部门OU">
              <template slot-scope="scope">
                {{scope.row.ou?scope.row.ou.split(',')[1].split('=')[1]:''}}
              </template>
            </el-table-column>
            <el-table-column prop="role" label="角色">
              <template slot-scope="scope">
                {{ scope.row.role==='asset'?'资产管理员':scope.row.role==='tenant'?'云管理员':scope.row.role==='support'?'在线支持组':scope.row.role==='troubleshooting'?'故障报修组':'普通用户'}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-wrap" v-show="transferList.length" style="text-align: center;margin-right:0">
          <el-pagination @current-change="handleCurrentChange3" @size-change="handleSizeChange3"
            :current-page="currentPageT" :page-sizes="[10, 20, 30, 40]" :page-size="currentSizeT"
            layout="total, sizes, prev, pager, next" :total="countTransfer">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" :disabled="multSelectionTransfer.length===0"
          @click="addAccount">确
          定</el-button>
        <el-button @click="resourceForm = false">取 消</el-button>
      </div>
    </el-dialog> -->
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
        // messageList: [],
        // transferList: [],
        btnLoading: false,
        tagState: '',
        rform: {
          role: 'user'
        },
        editRoleForm: false,
        // resourceForm: false,
        applyState: '',
        roleList: [{
          value: 'user',
          label: '学员'
        }, {
          value: 'tenant',
          label: '老师'
        }],
        // tagList: [],
        // messageFormMul: false,
        // aform: {
        //   message: ''
        // },
        // currentPage5: 1,
        // currentSize1: 10,
        // currentPageT: 1,
        // currentSizeT: 10,
        // countTran: 0,
        // countTransfer: 0,
        // currentPage6: 1,
        // currentSize2: 10,
        countMessage: 0,
        // tagListSelect: [],
        // transformForm: false,
        // messageForm: false,
        // messageFormOu: false,
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
        // multSelectionTran: [],
        // multSelectionTransfer: [],
        // backTag: {
        //   tagId: '',
        //   name: ''
        // },
        backData: {
          role: ''
        },
        // typeListS: {},
        // typeList: ['primary', 'success', 'warning', 'danger', 'info'],
        // dialogMessage: false,
        // transferData: {},
        // backId: '',
        // backNum: 0,
        // ouSelectList: [],
        // applyOu: []
      }
    },
    created() {
      this.getVmList(1);
      //     this.getOu();
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
      //     getOu() {
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
      clearC(v) {
        // console.log(v, this.applyOu)
        // if (v.length === 0) {
        this.getVmList('', 1)
        // }
      },
      // setQuotaId(id){
      //     this.backId= id
      //     // console.log(this.backId)
      // },
      //   handleChange(val, d) {
      //     this.backNum = val;
      //     setTimeout(() => {
      //       if (this.backNum === val) {
      //         console.log(val)
      //         let para = {
      //           id: this.backId,
      //           quota: this.backNum,
      //         }
      //         console.log(para)
      //         httpAjax('user/updateUserQuota ', para).then(res => {
      //           console.log(res)
      //           if(res.result=='success'){
      //               this.$message({
      //                   type:'success',
      //                   message:'配额设置成功'
      //               })
      //           }else{
      //                this.$message({
      //                   type:'error',
      //                   message:res.resultDesc||'配额设置失败'
      //               })
      //           }
      //           this.getVmList();
      //         }).catch(() => {})
      //       }
      //     }, 1000)
      //     // console.log(val,d)
      //   },
      //   handleCurrentChange3(val) { //资源转移
      //     this.multSelectionTransfer = [];
      //     this.currentPageT = val;
      //     this.openResourceTransfer()
      //   },
      //   handleSizeChange3(val) { //资源转移
      //     this.multSelectionTransfer = [];
      //     this.currentSizeT = val;
      //     this.openResourceTransfer()
      //   },
      //   openResourceTransfer(data = '') { //资源转移
      //     if (data) {
      //       this.transferData = {
      //         ...data
      //       };
      //     }
      //     let para = {
      //       page: this.currentPageT,
      //       limit: this.currentSizeT,
      //         role: 'tenant'
      //     }
      //     const url = `user/adminUserList?${Math.random()}`
      //     httpGet(url, para).then((res) => {
      //       //   this.tableData = res.data;
      //       this.transferList = res.data
      //       this.countTransfer = res.count;
      //       this.$nextTick(() => {
      //         this.setScrollBar('#table-wrapTransfer')
      //       })
      //     }).catch((error) => {
      //       console.log(error)
      //     })
      //     this.resourceForm = true;
      //   },
      //   openMsgList() { //打开发送状态
      //     this.dialogMessage = true;
      //     let para = {
      //       page: this.currentPage6,
      //       limit: this.currentSiz2,
      //       result: this.sendState
      //     }
      //     httpAjax('userTag/messageList ', para).then(res => {
      //       // console.log(res)
      //       this.messageList = res.data
      //       this.countMessage = res.count;
      //       this.$nextTick(() => {
      //         this.setScrollBar('#table-wrapMessage')
      //       })
      //     }).catch(() => {})
      //   },
      //   handleCurrentChange2(val) {
      //     this.currentPage6 = val;
      //     this.openMsgList()
      //   },
      //   handleSizeChange2(val) {
      //     this.currentSize2 = val;
      //     this.openMsgList()
      //   },
      //   getTag() { //获取tag筛选
      //     let para = {
      //       page: 1,
      //       limit: 1000,
      //     }
      //     httpAjax('userTag/tagList', para).then(res => {
      //       this.tagListSelect = res.data.map((item, idx) => {
      //         let index = idx % 5 ? idx % 5 : 0;
      //         this.typeListS[item.id] = this.typeList[index]
      //         return {
      //           value: item.id,
      //           label: item.name,
      //         }
      //       })
      //       //   console.log(this.typeListS)
      //     }).catch(() => {})
      //   },
      //   sendMessage() { //打开发送消息
      //     this.messageFormMul = true;
      //   },
      //   serviceConfirmOu() {//发送用户或者tag消息
      //     this.btnLoading = true;
      //     let f = {
      //         message: this.aform.message,
      //         ou: this.backTag,
      //       }
      //     // console.log(f)
      //     httpAjax('userTag/sendDeptMessage', f).then(res => {
      //       if (res.result == 'success') {
      //         this.$message({
      //           type: 'success',
      //           message: '发送成功!'
      //         });
      //         // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
      //         //   confirmButtonText: '确定',
      //         //   type: 'success',
      //         //   callback: action => {
      //         //     this.multSelection = []
      //         //     this.getVmList()
      //         //   }
      //         // });
      //         this.getVmList()
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '部分用户发送失败!请打开消息记录查看详细'
      //         });
      //       }
      //       this.messageFormOu = false;
      //       this.btnLoading = false;
      //     }).catch(() => {
      //       this.btnLoading = false;
      //     })
      //   },
      //   serviceConfirm(type = '') { //发送用户或者tag消息
      //     this.btnLoading = true;
      //     let f;
      //     if (type === 'tag') {
      //       f = {
      //         message: this.aform.message,
      //         users: '',
      //         tagId: this.backTag.tagId
      //       }
      //     } else if (type === 'user') {
      //       f = {
      //         message: this.aform.message,
      //         tagId: '',
      //         users: this.multSelection.map(item => {
      //           return item.name
      //         }).join(',')
      //       }
      //     } else {
      //       f = {
      //         message: this.aform.message,
      //         ou: this.backTag,
      //       }
      //     }
      //     // console.log(f)
      //     httpAjax('userTag/sendMessage', f).then(res => {
      //       if (res.result == 'success') {
      //         this.$message({
      //           type: 'success',
      //           message: '发送成功!'
      //         });
      //         // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
      //         //   confirmButtonText: '确定',
      //         //   type: 'success',
      //         //   callback: action => {
      //         //     this.multSelection = []
      //         //     this.getVmList()
      //         //   }
      //         // });
      //         this.getVmList()
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '部分用户发送失败!请打开消息记录查看详细'
      //         });
      //       }
      //       this.messageForm = false;
      //       this.messageFormMul = false;
      //       this.btnLoading = false;
      //     }).catch(() => {
      //       this.btnLoading = false;
      //     })
      //   },
      //   confirmTagUser() {//保存标签到用户
      //     if (this.multSelectionTran === 0) {
      //       this.$message.error('请选择一个标签')
      //       return
      //     }
      //     let f = {
      //       tagId: this.multSelectionTran[0].id,
      //       users: this.multSelection.map(item => {
      //         return item.name
      //       }).join(',')
      //     };
      //     this.btnLoading = true;
      //     httpAjax('userTag/saveUser', f).then(res => {
      //       if (res.result == 'success') {
      //         this.$message({
      //           type: 'success',
      //           message: '保存成功!'
      //         });
      //         // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
      //         //   confirmButtonText: '确定',
      //         //   type: 'success',
      //         //   callback: action => {
      //         //     this.multSelection = []
      //         //     this.getVmList()
      //         //   }
      //         // });
      //         this.transformForm = false;
      //         this.getVmList()
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '保存失败!'
      //         });
      //       }
      //       this.btnLoading = false;
      //     }).catch(() => {
      //       this.btnLoading = false;
      //     })
      //   },
      addAccount(formName) { //修改角色提交
        // this.$refs[formName].validate((valid) => {
        let f = {
          name: this.backData.name,
          role: this.rform.role
        };
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
          //   case 'aform':
          //     this.aform = {
          //       message: '',
          //     }
          //     this.backTag = {
          //       tagId: '',
          //       name: ''
          //     }
          //     this.$refs['aform'].resetFields();
          //     break;
          case 'rform':
            this.rform = {
              role: 'user'
            }
            this.$refs['rform'].resetFields();
            break;
            //   case 'dialogMessage':
            //     this.sendState = '';
            //     this.currentPage6 = 1;
            //     this.currentSize2 = 10;
            //     this.$nextTick(() => {
            //       this.setScrollBar('#table-wrapMessage')
            //     })
            //     break;
            //   case 'transformForm':
            //     this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
            //     this.multSelectionTran = []
            //     // this.userListData = [];
            //     this.currentPage5 = 1;
            //     this.currentSize1 = 10;
            //     this.$nextTick(() => {
            //       this.setScrollBar('#table-wrapTran')
            //     })
            //     break;
            //   case 'multipleTableTransfer':
            //     this.$refs.multipleTableTransfer.toggleRowSelection(this.multSelectionTransfer[0]);
            //     this.multSelectionTransfer = []
            //     // this.userListData = [];
            //     this.currentPageT = 1;
            //     this.currentSizeT = 10;
            //     this.$nextTick(() => {
            //       this.setScrollBar('#table-wrapTransfer')
            //     })
            //     break;

          default:
            break;
        }
      },
      //   addCate() {
      //     this.$prompt('请输入标签名称', '创建标签', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       inputPattern: /.+/,
      //       inputErrorMessage: '请输入标签名称'
      //     }).then(({
      //       value
      //     }) => {
      //       let params = {
      //         id: '',
      //         name: value
      //       }
      //       httpAjax('userTag/saveTag', params).then(res => {
      //         if (res) {
      //           this.$message({
      //             type: 'success',
      //             message: '创建成功'
      //           });
      //           this.openTag();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '创建失败!'
      //           });
      //         }
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '创建失败!'
      //         });
      //       })
      //     }).catch(() => {});
      //   },
      //   editCate(data) { //修改标签
      //     this.$prompt('请输入标签名称', '修改标签', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       inputPattern: /.+/,
      //       inputErrorMessage: '请输入标签名称',
      //       inputValue: data.name
      //     }).then(({
      //       value
      //     }) => {
      //       this.btnIndex = data.id
      //       this.btnLoading = true;
      //       let params = {
      //         id: data.id,
      //         name: value
      //       }
      //       httpAjax('userTag/updateTag', params).then(res => {
      //         if (res) {
      //           this.$message({
      //             type: 'success',
      //             message: '修改成功'
      //           });
      //           this.openTag();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '修改失败!'
      //           });
      //         }
      //         this.btnLoading = false;
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '修改失败!'
      //         });
      //         this.btnLoading = false;
      //       })
      //     }).catch(() => {});
      //   },
      //   handleClick(data) { //删除标签
      //     this.$confirm('删除后,该标签下的所有用户将被移除!', '确定删除该标签吗?', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.btnIndex = data.id
      //       this.btnLoadingD = true;
      //       let params = {
      //         id: data.id
      //       }
      //       httpAjax('userTag/deleteTag', params).then(res => {
      //         if (res.result == "success") {
      //           this.$message({
      //             type: 'success',
      //             message: '删除成功'
      //           });
      //           this.openTag();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '删除失败!'
      //           });
      //         }
      //         this.btnLoadingD = false;
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '删除失败!'
      //         });
      //         this.btnLoadingD = false;
      //       })
      //     }).catch(() => {

      //     })


      //   },
      //   rowClick2(row, column, event) { //转移选择
      //     if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
      //       return
      //     }
      //     if (this.multSelectionTransfer.length > 0 && this.multSelectionTransfer[0].id !== row.id) {
      //       this.$refs.multipleTableTransfer.toggleRowSelection(this.multSelectionTransfer[0]);
      //       this.multSelectionTransfer = [row];
      //     } else if (this.multSelectionTransfer.length > 0 && this.multSelectionTransfer[0].id === row.id) {
      //       this.multSelectionTransfer = [];
      //     } else {
      //       this.multSelectionTransfer = [row];
      //     }
      //     this.$refs.multipleTableTransfer.toggleRowSelection(row);
      //   },
      //   checkSelect2(selection, row) { //转移选择
      //     if (selection.length > 1) {
      //       this.$refs.multipleTableTransfer.toggleRowSelection(selection[0]);
      //     }
      //     this.multSelectionTransfer = selection;
      //     // console.log(selection, row)
      //   },
      //   rowClick1(row, column, event) { //标签选择
      //     if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
      //       return
      //     }
      //     if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id !== row.id) {
      //       this.$refs.multipleTableTran.toggleRowSelection(this.multSelectionTran[0]);
      //       this.multSelectionTran = [row];
      //     } else if (this.multSelectionTran.length > 0 && this.multSelectionTran[0].id === row.id) {
      //       this.multSelectionTran = [];
      //     } else {
      //       this.multSelectionTran = [row];
      //     }
      //     this.$refs.multipleTableTran.toggleRowSelection(row);
      //   },
      //   checkSelect1(selection, row) { //标签选择
      //     if (selection.length > 1) {
      //       this.$refs.multipleTableTran.toggleRowSelection(selection[0]);
      //     }
      //     this.multSelectionTran = selection;
      //     // console.log(selection, row)
      //   },
      //   closeTag(data, tag) {//删除标签
      //     // console.log(1)
      //     this.$confirm('确定删除该标签吗?', '删除标签', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       let params = {
      //         tagId: tag.tagId,
      //         user: data.name
      //       }
      //       httpAjax('userTag/deleteUser', params).then(res => {
      //         if (res.result == "success") {
      //           this.$message({
      //             type: 'success',
      //             message: '删除成功'
      //           });
      //           this.getVmList();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '删除失败!'
      //           });
      //         }
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '删除失败!'
      //         });
      //       })
      //     }).catch(() => {

      //     })

      //   },
      //   checkTag(tag) {
      //     this.backTag = tag;
      //     // console.log(this.backTag)
      //     this.messageForm = true;
      //   },
      //   checkTagOu(ou) {
      //     this.backTag = ou.split(',')[1].split('=')[1];
      //     // console.log(this.backTag)
      //     this.messageFormOu = true;
      //   },
      //   rowClick(row, column, event) { //列表选择
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
      //   openTag() { //打开tag列表
      //     let para = {
      //       page: this.currentPage5,
      //       limit: this.currentSiz1,
      //     }
      //     httpAjax('userTag/tagList', para).then(res => {
      //       this.tagList = res.data
      //       this.countTran = res.count;
      //       this.$nextTick(() => {
      //         this.setScrollBar('#table-wrapTran')
      //       })
      //     }).catch(() => {})
      //     this.transformForm = true;
      //   },
      //   exportData() {
      //     window.open('/api/user/exportData')
      //   },
      refreshData(formName) {
        this.text = '正在同步,请稍后...';
        this.loadingState = true;
        httpAjax('user/synAllAdUsers').then(res => {
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
        }).catch(() => {
          this.loadingState = false;
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
        })
      },
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
      //   handleClickChar(data) { //删除
      //     this.$confirm('取消后该人员角色将变为普通用户!', '确定取消该角色吗?', {
      //       confirmButtonText: '确定',
      //       confirmButtonClass: 'el-button--danger',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       84
      //       this.btnIndex = data.id
      //       this.btnLoadingD = true;
      //       let params = {
      //         name: data.name,
      //         role: 'user'
      //       };
      //       httpAjax('user/setUserRole', params).then(res => {
      //         if (res.resultCode == 0) {
      //           this.$message({
      //             type: 'success',
      //             message: '取消成功!'
      //           });
      //           // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
      //           //   confirmButtonText: '确定',
      //           //   type: 'success',
      //           //   callback: action => {
      //           //     this.multSelection = []
      //           //     this.getVmList()
      //           //   }
      //           // });
      //           this.getVmList()
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: res.resultDesc
      //           });
      //         }
      //         this.btnLoadingD = false;
      //       }).catch(() => {
      //         this.btnLoadingD = false;
      //       })
      //     }).catch(() => {

      //     })


      //   },
      editCharacter(data) { //修改角色
        this.backData = data;
        this.backData.role = data.role ? data.role : 'user';
        this.rform.role = data.role ? data.role : 'user';
        this.editRoleForm = true;
      },
      //   handleClick(data) { //删除
      //     this.$confirm('确定解除该管理员吗?', '解除资产管理员', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.btnIndex = data.id
      //       this.btnLoadingD = true;
      //       let params = {
      //         name: data.name,
      //         role: ''
      //       }
      //       httpAjax('user/setRole', params).then(res => {
      //         if (res) {
      //           this.$message({
      //             type: 'success',
      //             message: '解除成功'
      //           });
      //           this.getVmList();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '解除失败!'
      //           });
      //         }
      //         this.btnLoadingD = false;
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '解除失败!'
      //         });
      //         this.btnLoadingD = false;
      //       })
      //     }).catch(() => {

      //     })


      //   },

      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },

      getVmList(first, page) {
        // this.multSelection = [];
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          name: this.applyUser,
          role: this.applyState,
        //   tag: this.tagState,
        //   ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `user/adminUserList?${Math.random()}`
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
