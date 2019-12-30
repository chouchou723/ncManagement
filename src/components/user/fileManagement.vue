<template>
  <div id="fileManagement">
    <div class="search-wrap">
      <el-input placeholder="请输入文件名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px;" @click="updateDesk">上传<i
          class="el-icon-upload el-icon--right"></i></el-button>
      <div style="width:300px;float:right;margin-right:10px;text-align:center;margin-top:5px;">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="$store.state.usedRate"
          :status="$store.state.usedRate>50?'exception':''"></el-progress>
        <span style="color:#909399;font-size:14px;">
          已使用:{{calSize($store.state.usedQuota)}},剩余容量:{{$store.state.leftQuota}}
        </span>
      </div>

    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <div class="newBtnWrap">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane name="myFile">
            <span slot="label"><i class="el-icon-tickets" style="margin-right:10px"></i>我的文件</span>
          </el-tab-pane>
          <el-tab-pane name="shareFile">
            <span slot="label"><i class="iconfont icon-weituoguanxiguanli" style="margin-right:10px"></i>共享文件</span>
          </el-tab-pane>
          <el-tab-pane name="download">
            <span slot="label"><i class="iconfont icon-shangchuanwenjian"
                style="margin-right:10px"></i>上传列表{{listNum}}</span>
          </el-tab-pane>
        </el-tabs>
        <el-button-group v-if="multSelection.length>0||multSelectionS.length>0" class="btnDiv">
          <el-button size="small" type="primary" @click="shareData" icon="el-icon-share" v-if="activeName==='myFile'">
            分享
          </el-button>
          <el-button size="small" type="primary" @click="downloadData" icon="el-icon-download"
            v-if="activeName!=='download'">下载
          </el-button>
          <el-button size="small" type="danger" @click="deleteData" :loading="btnLoadingD" icon="el-icon-close"
            v-if="activeName==='myFile'">删除
          </el-button>
        </el-button-group>

      </div>
      <el-table :data="tableData" ref="multipleTable" v-loading="vmTableLoadingState" :height="tableHeight"
        v-show="activeName==='myFile'" @row-click="rowClick" @selection-change="handleSelectionChangeMerge"
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称" :min-width="200">
          <template slot-scope="scope">
            <div class="fileN">
              <div style="display: flex;align-items:center;">
                <img :src="getIcon(scope.row.fileSuffix)" alt="" style="margin-right:10px">
                <span :style="btnIndex.indexOf(scope.row.id)>-1?'color:#409eff':''">
                  {{scope.row.fileName}}
                </span>
                <el-popover placement="right" title="被分享人" width="200" trigger="hover" @show='getShare(scope.row.uuid)'>
                  <div>
                    {{shareContent}}
                  </div>
                  <div style="position:absolute;top:5px;right:10px;">
                    <el-button @click="cancelShare(scope.row)" type="danger" size="mini" round>取消分享</el-button>
                  </div>
                  <div slot="reference">
                    <i class="el-icon-share"
                      style="margin-left:10px;color:#409eff;font-size:18px;vertical-align: middle;"
                      v-if="scope.row.share==='yes'"></i>
                  </div>
                </el-popover>
              </div>
              <div class="fileOp">
                <el-button @click="editCate(scope.row)" type="text" style="padding:0px;color:#42b983">分享</el-button>
                <!-- <el-button @click="cancelShare(scope.row)" type="text" style="padding:0px;color:#E6A23C"
                  v-if="scope.row.share==='yes'">取消分享</el-button> -->
                <el-button @click="downFile(scope.row.fileName,scope.row.path,scope.row.uuid)" type="text"
                  style="padding:0px">下载
                </el-button>
                <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
                  :loading="btnLoadingD&&(btnIndex==scope.row.id)">
                  {{btnLoadingD&&(btnIndex==scope.row.id)?'删除中':'删除'}}
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="300">
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建日期" width="300">
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
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0">下载</el-button>
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-table :data="tableDataS" ref="multipleTableS" v-loading="vmTableLoadingState" :height="tableHeight"
        v-show="activeName==='shareFile'" @row-click="rowClickS" @selection-change="handleSelectionChangeMergeS"
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称" :min-width="200">
          <template slot-scope="scope">
            <div class="fileN">
              <div style="display: flex;align-items:center;">
                <img :src="getIcon(scope.row.fileSuffix)" alt="" style="margin-right:10px">
                <span>
                  {{scope.row.fileName}}
                </span>
              </div>
              <div class="fileOp">
                <el-button @click="downFile(scope.row.fileName,scope.row.path,scope.row.uuid)" type="text"
                  style="padding:0px">下载
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小">
        </el-table-column>
        <el-table-column prop="user" label="分享人">
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建日期" width="220">
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
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:12px 0">下载</el-button>
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 上传列表 -->
      <el-table :data="Object.values($store.state.uploadList)" ref="multipleTableD" v-loading="vmTableLoadingState"
        :height="tableHeight" v-show="activeName==='download'" :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">

        <el-table-column prop="name" label="文件名称">
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="150">
          <template slot-scope="scope">
            <div>
              {{calSize(scope.row.size)}}
              <!-- {{scope.row.size/1024<1?scope.row.size+'b':scope.row.size/1024/1024<1?(scope.row.size/1024).toFixed(2)+'K':scope.row.size/1024/1024/1024<1?(scope.row.size/1024/1024).toFixed(2)+'M':(scope.row.size/1024/1024/1024).toFixed(2)+'G'}} -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="上传状态" width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.status!=='downloading'" :style="scope.row.status==='fail'?'color:#F56C6C':''">
              {{(scope.row.status==='ready'||scope.row.status==='goon')?'等待中':scope.row.status==='pause'?'已暂停':scope.row.status==='fail'?'上传失败':''}}
            </div>
            <el-progress v-if="scope.row.status==='downloading'||scope.row.status==='transfer'" :text-inside="true"
              :stroke-width="18" :percentage="(scope.row.progress*100).toFixed(2)"
              :status="(scope.row.progress*100)<100?'':'success'"></el-progress>
            <div v-if="scope.row.status==='transfer'">上传完成,文件处理中...</div>
          </template>
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
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">

            <el-button v-if="scope.row.status==='fail'" @click="setUploadStatus('goon',scope.row.name)" type="text"
              style="padding:0">
              <i class="el-icon-refresh" style="font-size:17px;"></i>
            </el-button>
            <el-button v-if="scope.row.status==='pause'" @click="setUploadStatus('goon',scope.row.name)" type="text"
              style="padding:0">
              <i class="iconfont icon-bofang"></i>
            </el-button>
            <el-button v-if="scope.row.status==='downloading'" @click="setUploadStatus('pause',scope.row.name)"
              type="text" style="padding:0">
              <i class="iconfont icon-zanting"></i>
            </el-button>
            <el-button @click="setUploadStatus('cancel',scope.row.name)" type="text" style="color:#f10000;padding:0"
              v-if="scope.row.status!=='transfer'">
              <i class="iconfont icon-guanbi"></i>
              <!-- {{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}} -->
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap'
      v-if="(activeName==='myFile'&&tableData.length)||(activeName==='shareFile'&&tableDataS.length)">
      <div class="page-wrap" v-if="activeName!=='download'">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible" :close-on-click-modal="no" 
    top='10%' @close='resetD("aform")' width="50%">
      <!-- <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar"> -->
      <el-upload class="upload-demo" drag :on-change="fileChange" :auto-upload="false" multiple :show-file-list='false'>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">支持断点续传,页面刷新后需要重新上传</div>
      </el-upload>
      <!-- </el-scrollbar> -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div> -->
    </el-dialog>
    <!-- 分享给  -->
    <el-dialog :title="`分享文件:${fileTitle}`" :visible.sync="modalState1" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='6%' @close='resetD("b")'>
      <h4 slot="header">选择用户</h4>
      <div class="search-wrap">
        <el-input placeholder="请输入用户名称" v-model="queryUserName" style="width:185px;" clearable
          @keyup.enter.native="queryUserList('',1)" @clear="queryUserList('',1)" />
        <el-button type="ghost" @click="queryUserList('',1)"><i class="el-icon-search"></i>查询</el-button>
        <!-- <el-button type="primary" @click="serviceConfirm">确定</el-button> -->
      </div>
      <div class="table-wrap" id="table-wrapShare">
        <el-table :data="userListData" height="360" ref="multipleTableShare" stripe
          :header-cell-style="{'text-align':'center'}" @selection-change="handleSelectionChangeShare"
          @row-click="rowClickShare" :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="被分享人">
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
        <el-button type="primary" @click="serviceConfirm" :disabled="this.tableChecked.length==0" :loading="btnLoading">
          确 定</el-button>
        <el-button @click="cancelModel">取 消</el-button>
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
      return {
        // usedRate: 0,
        // leftQuota: '',
        shareContent: '',
        activeName: 'myFile',
        // faId: '',
        // autoUpload: true,
        btnLoading: false,
        btnLoadingD: false,
        btnIndex: '',
        no: false,
        tableData: [],
        tableDataS: [],
        count: 0,
        count1: 0,
        tableHeight: 400,
        total: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentPage5: 1,
        currentSize: 20,
        currentSize1: 10,
        multSelection: [],
        multSelectionS: [],
        // selectRowData: [],
        applyUser: '',
        // applyTable: '',
        // applyState: '',
        // applyLoginState: '',
        // loadingState: false,
        // text: '请稍后',
        dialogFormVisible: false,
        // formLabelWidth: '180px',
        // inputLabelWidth: '300px',
        // dialogFormVisibleP: false,
        modalState1: false,
        backData: '',
        fileTitle: '',
        queryUserName: '',
        userListData: [],
        downList: null,
        // pickerOptions2: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now();
        //   }
        // },
        // dialogFormVisibleSyn: false,
        // detailSupport: {},
        fileList: [],
        fileListS: [],
        tableChecked: []
        // sysRes: '',
        // clientRes: ''
      }
    },
    created() {
      this.getVmList(1)
      //   this.getLimitQuota();
    },
    watch: {
      '$store.state.allDone'(n, o) { //接收首页状态
        // console.log(n,o)
        if (n === 'done') {
          this.activeName = 'myFile'
          this.tabClick();
        }
      },
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    computed: {
      listNum() {
        let a = Object.keys(this.$store.state.uploadList).length;
        // console.log(a)
        return a > 0 ? `(${a})` : ''
      }
    },
    methods: {
        beforeClose(){
            console.log(12323910321931)
        },
      //   getLimitQuota() {
      //     var params = {
      //       user: sessionStorage.getItem('username'),
      //     }
      //     let url = `bigFile/refreshQuota `
      //     httpAjax(url, params).then((res) => {
      //       this.usedRate = res.rate
      //       this.leftQuota = res.left
      //     }).catch((err) => {
      //       console.log(err)
      //     })
      //   },
      getShare(uuid) {
        var params = {
          uuid: uuid,
        }
        let url = `bigFile/shareList`
        httpAjax(url, params).then((res) => {

          this.shareContent = res.map(item => item.user).join(',')
        }).catch((err) => {
          console.log(err)
        })
      },
      serviceConfirm() { //确定分享
        var params = {
          uuids: this.backData,
          users: this.tableChecked.map(item => item.name).join(','),
        }
        let url = `bigFile/share`
        this.btnLoading = true;
        httpAjax(url, params).then((res) => {
          this.btnLoading = false;
          this.modalState1 = false;
          this.$message.success('分享成功')
          this.getVmList()
        }).catch((err) => {
          this.btnLoading = false;
          this.modalState1 = false;
          console.log(err)
        })
      },
      cancelModel() {
        this.modalState1 = false;
      },
      rowClickShare(row, column, event) { //分享的弹框
        if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
          return
        }
        if (this.tableChecked.length > 0 && this.tableChecked.filter(item => item.id === row.id).length === 0) {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          this.tableChecked = [...this.tableChecked, row];
        } else if (this.multSelection.length > 0 && this.tableChecked.filter(item => item.id === row.id).length ===
          1) {
          this.tableChecked = this.tableChecked.filter(item => item.id !== row.id);
        } else {
          this.tableChecked = [row];
        }
        // console.log(  this.multSelection)
        this.$refs.multipleTableShare.toggleRowSelection(row);
      },
      handleSelectionChangeShare(val) { //分享的弹框
        this.tableChecked = val;
      },
      queryUserList(first, page) { //查询用户
        // var page = typeof num == 'number' ? num : 1;
        page ? this.currentPage5 = page : '';
        var params = {
          name: this.queryUserName,
          page: this.currentPage5,
          limit: this.currentSize1
        }
        let url = `user/userList`
        httpAjax(url, params).then((res) => {
          this.userListData = res.data
          this.count1 = res.count
          this.$nextTick(() => {
            this.setScrollBar('#table-wrapShare', true)
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      downloadData() { //群下载
        // this.multSelection.forEach(item=>{
        //     console.log(1)
        //     // setTimeout(()=>{
        //         this.downFile(item.fileName,item.path)
        //     // },1200)
        // })
        this.$message.warning('如若未弹出下载,请检查浏览器是否拦截了弹框')
        let checkList = this.activeName === 'myFile' ? this.multSelection : this.multSelectionS
        this.downList = setInterval(() => {
          if (checkList.length > 0) {
            let data = checkList.shift();
            this.downFile(data.fileName, data.path, data.uuid)
          } else {
            clearInterval(this.downList);
            this.downList = null;
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTableS.clearSelection();
          }
        }, 1000);
      },
      shareData() { //点击多选分享
        this.queryUserList();
        this.fileTitle = this.multSelection[0].fileName + '等';
        this.backData = this.multSelection.map(item => item.uuid).join(',');
        this.modalState1 = true;
      },
      editCate(data) { //点击单独分享
        this.queryUserList();
        this.fileTitle = data.fileName;
        this.backData = data.uuid;
        this.modalState1 = true;
      },
      downFile(name, path, uuid) { //下载
        // let params = {
        //   fileName: name,
        //   path: path
        // }
        // let url = 'bigFile/download'
        // httpAjax(url, params).then((res) => {}).catch((err) => {
        //   console.log(err)
        // })
        window.open(`/dcp/bigFile/download?fileName=${name}&path=${path}&uuid=${uuid}`)
      },
      getIcon(type) {
        let img = ['jpeg', 'bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd',
          'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp'
        ];
        let video = ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', '3gp']
        let word = ['txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'et', 'ett', 'xml', 'dps', 'dpt']
        let rar = ['rar', 'zip'];
        let exe = ['exe', 'msi', 'iso', '']
        let pdf = ['pdf'];
        if (img.includes(type)) {
          return require('../../assets/img/Picture_24_7d34de9.png')
        } else if (video.includes(type)) {
          return require('../../assets/img/Video_24_703ade3.png')
        } else if (word.includes(type)) {
          return require('../../assets/img/Word_24_2f2aefb.png')
        } else if (rar.includes(type)) {
          return require('../../assets/img/ZIP_24_7d2970f.png')
        } else if (exe.includes(type)) {
          return require('../../assets/img/EXE_24_fb4c338.png')
        } else if (pdf.includes(type)) {
          return require('../../assets/img/PDF_24_694b0da.png')
        } else {
          return require('../../assets/img/Misc_24_af08942.png')
        }

      },
      setUploadStatus(type, name) {
        this.$store.commit('setUploadStatus', {
          type,
          name
        }) //数组列表保存上传列表的属性
      },
      calSize(size) {
        let sizeK = size / 1024;
        let sizeM = size / 1024 / 1024;
        let sizeG = size / 1024 / 1024 / 1024;
        return sizeK < 1 ? size + 'B' : sizeM < 1 ? sizeK.toFixed(2) + 'KB' : sizeG < 1 ? sizeM.toFixed(2) + 'MB' :
          sizeG
          .toFixed(2) + 'GB'
      },
      tabClick() {
        this.multSelection = [];
        this.multSelectionS = [];
        this.currentPage4 = 1;
        this.currentSize1 = 20;
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTableS.clearSelection();
        if (this.activeName === 'shareFile') {
          //获取共享数据
          this.vmTableLoadingState = true;
          this.getShareList(1)
        } else if (this.activeName === 'myFile') {
          this.vmTableLoadingState = true;
          this.getVmList(1)
        }
      },
      fileChange(file, fileList) {
              this.dialogFormVisible = false;
        //需要加容量的判断
        let left = this.$store.state.leftRaw
        // console.log(file.size,left)
        if (file.size > left) {
          this.$message.warning('文件空间已满,无法继续上传')
          this.dialogFormVisible = false;
          return
        }
        if (file.name in this.$store.state.uploadList) {
          this.$message.warning('任务已存在')
          //   this.dialogFormVisible = false;
          //   this.activeName = 'download'
          //   return
        }
        if (file.size === 0) {
          this.$message.warning('文件:' + file.name + '大小为0,无法上传!')
          //   this.dialogFormVisible = false;
          //   this.activeName = 'download'
          //   return
        }
        // this.fileList = [...this.fileList, file.name];
        if (!(file.name in this.$store.state.uploadList) && file.size !== 0) {
          this.$store.commit('setUploadList', file) //数组列表保存上传列表的属性
          // console.log(this.$store.state.uploadList)
          this.$store.commit('SETFILE', file) //共享列表给header调上传
        }
        // if (this.fileList.length === fileList.length) {
          //   this.dialogFormVisible = false;
        //   console.log(this.fileList.length,fileList.length,999)
          this.activeName = 'download'
        //   setTimeout(() => {
              
        //   }, 500);
        // this.$nextTick(() => {
        // })
        // }
        // console.log(file,fileList)
      },
      updateDesk() { //点击新增
        this.dialogFormVisible = true;
        this.$store.commit('changeIsClick', true);
        this.$store.commit('resetFile');
        this.$store.commit('setNowStatus', {
          allDone: 'not'
        })
        // console.log(this.$store.state.allDone)
      },
      getnewQuota() {
        var params = {
          user: sessionStorage.getItem('username'),
        }
        let url = `bigFile/refreshQuota `
        httpAjax(url, params).then((res) => {
          this.$store.commit('setNowStatus', {
            usedRate: res.rate,
            leftQuota: res.left,
            usedQuota: res.used
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      deleteData(data) { //删除多个
        this.btnIndex = this.multSelection.map(item => item.id);
        this.$confirm('确定删除选中的文件吗?', '删除文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoadingD = true;
          let params = {
            uuids: this.multSelection.map(item => item.uuid).join(',')
          }
          httpAjax('bigFile/delete', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getVmList();
              this.getnewQuota();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnIndex = '';
            this.btnLoadingD = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnIndex = '';
            this.btnLoadingD = false;
          })
        }).catch(() => {
          this.btnIndex = '';
          this.multSelection = [];
          this.$refs.multipleTable.clearSelection();
        })
      },
      cancelShare(data) { //取消分享
        this.btnIndex = data.id + ''
        this.$confirm('确定取消分享该文件吗?', '取消分享文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoadingD = true;
          let params = {
            uuid: data.uuid
          }
          httpAjax('bigFile/unShare', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '取消成功'
              });
              this.getVmList();
            } else {
              this.$message({
                type: 'error',
                message: '取消失败!'
              });
            }
            this.btnLoadingD = false;
            this.btnIndex = '';
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '取消失败!'
            });
            this.btnLoadingD = false;
            this.btnIndex = '';
          })
        }).catch(() => {
          this.btnIndex = '';
        })
      },
      handleClick(data) { //删除
        this.btnIndex = data.id + ''
        this.$confirm('确定删除该文件吗?', '删除文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoadingD = true;
          let params = {
            uuids: data.uuid
          }
          httpAjax('bigFile/delete', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getVmList();
              this.getnewQuota();

            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnLoadingD = false;
            this.btnIndex = '';
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnLoadingD = false;
            this.btnIndex = '';
          })
        }).catch(() => {
          this.btnIndex = '';
        })
      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            // this.fileList = [];
            break;
          case 'b':
            this.queryUserName = '';
            this.currentPage5 = 1;
            this.currentSize1 = 10;
            this.multSelection = [];
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTableS.clearSelection();
            this.$refs.multipleTableShare.clearSelection();
            this.tableChecked = [];
          default:
            break;
        }
      },
      rowClick(row, column, event) { //我的文件点击
        if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
          return
        }
        if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length === 0) {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          this.multSelection = [...this.multSelection, row];
        } else if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length ===
          1) {
          this.multSelection = this.multSelection.filter(item => item.id !== row.id);
        } else {
          this.multSelection = [row];
        }
        // console.log(row)
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChangeMerge(val) { //我的文件点击
        this.multSelection = val;
      },
      rowClickS(row, column, event) { //共享文件点击
        if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
          return
        }
        if (this.multSelectionS.length > 0 && this.multSelectionS.filter(item => item.id === row.id).length === 0) {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          this.multSelectionS = [...this.multSelectionS, row];
        } else if (this.multSelectionS.length > 0 && this.multSelectionS.filter(item => item.id === row.id).length ===
          1) {
          this.multSelectionS = this.multSelectionS.filter(item => item.id !== row.id);
        } else {
          this.multSelectionS = [row];
        }
        // console.log(row)
        this.$refs.multipleTableS.toggleRowSelection(row);
      },
      handleSelectionChangeMergeS(val) { //共享文件点击
        this.multSelectionS = val;
      },
      searchData() {
        if (this.activeName === 'myFile') {
          this.getVmList('', 1)
        } else if (this.activeName === 'shareFile') {
          this.getShareList('', 1)
        }
      },
      clearData(num) {
        if (this.activeName === 'myFile') {
          this.getVmList('', 1)
        } else if (this.activeName === 'shareFile') {
          this.getShareList('', 1)
        }
      },
      getShareList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          fileName: this.applyUser
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `bigFile/myShareList?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableDataS = res.data;
          this.tableHeight = computedTableHeight()
          this.vmTableLoadingState = false;
          this.count = res.count;
          //   this.$nextTick(() => {
          //     this.setScrollBar('#table-wrap')
          //   })
        }).catch((error) => {
          console.log(error)
        })
      },
      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          fileName: this.applyUser
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `bigFile/pageList?${Math.random()}`
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
      handleCurrentChange1(val) {
        this.currentPage5 = val;
        this.getShareList()
      },
      handleSizeChange1(val) {
        this.currentSize1 = val;
        this.getShareList()
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

  .upload-demo {
    text-align: center;
    margin-bottom: 30px;
  }

  .newBtnWrap {
    /* display: flex;
    align-items: center; */
    position: relative;
    padding-left: 0;
  }

  .btnDiv {
    position: absolute;
    top: 10px;
    left: 380px;
  }

  .fileN {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fileN:hover .fileOp {
    display: block;
  }

  .fileOp {
    display: none;
    /* margin-left: 20%; */
  }

</style>
<style>
  #fileManagement .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }

  #fileManagement .el-tabs__nav {
    margin-left: 20px;
  }

</style>
