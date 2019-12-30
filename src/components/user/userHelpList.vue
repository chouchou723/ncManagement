<template>
  <div id="userHelpList">
    <!-- <div style="background:white;display:flex;width:100%;justify-content:space-between;align-items:center;border-bottom: solid 1px #e6e6e6;"> -->
    <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="1">DCMPortal</el-menu-item>
   <el-menu-item index="2">问题求助</el-menu-item>
    <el-menu-item index="3">用户手册</el-menu-item>
     <el-menu-item index="4">经验交流</el-menu-item>
</el-menu> -->
    <div class="search-wrap">
      <el-input placeholder="搜索帖子" style="width:185px;" clearable v-model="applyUser"  @keyup.enter.native="clearData" @clear="clearData(1)">
      </el-input>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <div style="float:right;margin-right:10px;">
        <el-button type="success" @click="openCate" v-if="localRole==='admin'">分类管理</el-button>
        <el-button type="primary" @click="updateDesk">发表新帖</el-button>
      </div>
    </div>
    <!-- </div> -->
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect"
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :show-header="true">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <!-- <el-table-column prop="tag" label="类型" width="150"
          :filters="[{ text: '问题求助', value: '1' }, { text: '用户手册', value: '4' }, { text: '经验交流', value: '5' }]"
          :filter-method="filterTag" filter-placement="bottom-start"> -->
        <el-table-column width="150">
          <template slot="header">
            <el-dropdown placement="bottom-start" @command="handleCommand" style="height:30px">
              <span class="el-dropdown-link" style="cursor:pointer">
                {{commandName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">

                <el-dropdown-item icon="el-icon-menu" command="" v-if="commandName!=='全部'">全部</el-dropdown-item>
                <el-dropdown-item v-for="(item,index) in SelectDataC" :key="index" :command="item">{{item.cateName}}
                </el-dropdown-item>
                <!-- <el-dropdown-item icon="el-icon-document" command="4" v-if="commandName!=='用户手册'">用户手册</el-dropdown-item>
                <el-dropdown-item icon="el-icon-share" command="5" v-if="commandName!=='经验交流'">经验交流</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div style="padding:9px 0">[{{scope.row.cateName}}]</div>
          </template>
        </el-table-column>
        <el-table-column prop="cateName" label="标题" min-width="200">
          <template slot-scope="scope">
            <div style="max-width:690px;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;">
              <!-- <span style="color:#409eff">
                      [{{scope.row.cateName}}]
                   </span> -->
              <!-- <span>
                       精
                   </span> -->
              <span style="cursor:pointer;color:#409eff" @click="openDetail(scope.row)">
                {{scope.row.infoTitle}}
              </span>
              <i class="el-icon-star-on" style="color:#f10000;" title="精华" v-if="scope.row.essence==1"></i>
              <i class="el-icon-upload2" style="color:#f10000;" title="置顶" v-if="scope.row.stick==1"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="作者">
          <template slot-scope="scope">
            {{scope.row.createUser}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发帖时间">
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).toLocaleString()}}
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
     <!-- 板块发布 -->
    <el-dialog title="分类管理" :visible.sync="dialogFormVisibleCate" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' width="40%" @close='resetD("aform")'>
      <cateList style="margin-bottom:10px;" @freshCate="freshCate">
      </cateList>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisibleCate = false">取 消</el-button>
      </div> -->
    </el-dialog>
    <!-- 发表新帖 -->
    <el-dialog title="发表新帖" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' width="40%" fullscreen @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="新帖类型：" :label-width="formLabelWidth" prop="cateId">
          <el-select style="width:190px;" placeholder="请选择新帖类型" v-model="aform.cateId">
            <el-option v-for="(item,index) in SelectData" :key="index" :value="item.id" :label="item.cateName">
              {{item.cateName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" :label-width="formLabelWidth" prop="infoTitle">
          <el-input v-model="aform.infoTitle" placeholder='请输入标题' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <el-form-item label="问题描述：" :label-width="formLabelWidth" prop="infoContent">
          <quill-editor v-model="aform.infoContent" ref="myQuillEditorNew"
            style="max-height:500px;height:400px;">
          </quill-editor>
        </el-form-item>
        <!-- <el-form-item label="上传文件" :label-width="formLabelWidth">
         <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 帖子详情 -->
    <el-dialog :visible.sync="dialogFormVisibleSyn" fullscreen custom-class='replayDia' @close='resetD("detailS")'>
      <div slot="title" style="display:flex;justify-content:flex-start;align-items:center;margin-bottom:10px;">
        <div style="font-weight:600;font-size:20px;min-width:130px;">
          {{detailSupport.infoTitle}}</div>
        <div style="margin-left:10px;flex:1" v-if="localRole==='admin'">
          <el-button type="primary" size="small" icon="el-icon-star-on" :loading="btnLoadingD" @click="setEss">
            {{detailSupport.essence==1?'取消精华':'加精'}}</el-button>
          <el-button type="warning" size="small" icon="el-icon-upload2" :loading="btnLoadingD" @click="setStick">
            {{detailSupport.stick==1?'取消置顶':'置顶'}}</el-button>
          <!-- <el-button type="text" style="color:#f10000;" @click="deleteT"
                v-if="detailSupport.createUser===localUser||localRole==='admin'" :loading="btnLoading">
                {{!btnLoading?'删 除':'删除中'}}</el-button> -->
        </div>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar">
        <div class="articleContainer">
          <div class="articleTitle articleTitleP">
            <img src="../../assets/img/ava.gif" alt="" width="70" height="70">
            <div class="articleUser" :title="detailSupport.createUser">
              {{detailSupport.createUser}}</div>
          </div>
          <div class="articleRight">
            <div v-html="detailSupport.infoContent" class="articleContent"></div>
            <div class="articleTime">
              <span v-if="detailSupport.essence==1" style="color:#ef1a2c;margin-right:5px;">精华</span>
              <span v-if="detailSupport.stick==1" style="color:#b35121;margin-right:5px;">置顶</span>
              <span class="articleGrey">1楼</span>
              <span class="articleGrey">{{new Date(detailSupport.createTime).toLocaleString()}}</span>
              <el-button type="text" @click="goto('replayC')">回 复</el-button>
              <el-button type="text" style="color:#f10000;" @click="deleteT"
                v-if="detailSupport.createUser===localUser||localRole==='admin'" :loading="btnLoadingD">
                {{!btnLoadingD?'删 除':'删除中'}}</el-button>
            </div>
          </div>
        </div>
        <div class="articleContainerR" v-for="(item,index) in replyList" :key="index">
          <div class="articleTitle">
            <img src="../../assets/img/ava.gif" alt="" width="70" height="70">
            <div class="articleUser" :title="item.createUser">
              {{item.user}}</div>
          </div>
          <div class="articleRight">
            <div v-html="item.helpContent" class="articleContent"></div>
            <div class="articleTime">
              <span class="articleGrey">{{(relpyCurr-1)*10+index+2}}楼</span>
              <span class="articleGrey">{{new Date(item.createTimeStr).toLocaleString()}}</span>
            </div>
          </div>
        </div>
        <div class="page-wrap" style="text-align:center;margin:10px 0;">
          <el-pagination @current-change="handleCurrentChangeRE" :current-page="relpyCurr" background
            layout="total, prev, pager, next" :total="replyCount">
          </el-pagination>
        </div>
        <div id="replayC" ref="replayC"
          style="margin-top:10px;display:flex:flex-direction:column;height:350px;position:relative;">
          <quill-editor v-model="infoContent" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style="height:250px">
          </quill-editor>
          <div style="position:absolute;bottom:0;right:0">
            <el-button type="primary" :loading="btnLoading" @click="saveReply" :disabled="!infoContent"
              style="margin-right:10px;">回 复
            </el-button>
          </div>
        </div>
      </el-scrollbar>
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
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {
    addQuillTitle
  } from '../../common/js/quillConfig'
  import {
    quillEditor
  } from 'vue-quill-editor'
  import cateList from '../system/cateList'
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
          dialogFormVisibleCate:false,
        SelectData: [],
        activeIndex: '1',
        btnLoading: false,
        btnLoadingD: false,
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
          // title: '',
          infoContent: '',
          infoTitle: '',
          cateId: '',
        },
        rules2: {
          cateId: [{
            required: true,
            message: '请选择新帖类型',
            // validator: nan16,
            trigger: 'change'
          }],
          infoTitle: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          infoContent: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }],
        },
        formLabelWidth: '130px',
        inputLabelWidth: '300px',
        dialogFormVisibleP: false,
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        dialogFormVisibleSyn: false,
        detailSupport: {},
        replyList: [],
        replyCount: 0,
        relpyCurr: 1,
        infoContent: '',
        rowCount: 0,
        commandName: '全部'
      }
    },
    created() {
      this.getSelectData()
      this.getVmList()
    },
    components: {
      quillEditor,cateList
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    computed: {
      SelectDataC() {
        return this.SelectData.filter(item => {
          return item.cateName !== this.commandName
        })
      },
      localUser() {
        return sessionStorage.getItem('username')
      },
      localRole() {
        return sessionStorage.getItem('role')

      }
    },
    methods: {
        openCate(){
            this.dialogFormVisibleCate = true;
        },
      setEss() {//设置精华
        this.btnLoadingD = true;
        let params = {}
        params.id = this.detailSupport.id
        params.essence = this.detailSupport.essence == 1 ? '' : 1;
        httpAjax('helpContent/essence', params).then(res => {
          if (res.success == "success") {
            this.$message({
              type: 'success',
              message: '设置成功'
            });
            this.detailSupport.essence = params.essence;
            //  scrollLeft('#table-wrap')
            this.getVmList();
          } else {
            this.$message({
              type: 'error',
              message: '设置失败!'
            });
          }
          this.btnLoadingD = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '设置失败!'
          });
          this.btnLoadingD = false;
        })
      },
      setStick() {
        this.btnLoadingD = true;
        let params = {}
        params.id = this.detailSupport.id
        params.stick = this.detailSupport.stick == 1 ? '' : 1;
        httpAjax('helpContent/stick', params).then(res => {
          if (res.success == "success") {
            this.$message({
              type: 'success',
              message: '设置成功'
            });
            this.detailSupport.stick = params.stick;
            //  scrollLeft('#table-wrap')
            this.getVmList();
          } else {
            this.$message({
              type: 'error',
              message: '设置失败!'
            });
          }
          this.btnLoadingD = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '设置失败!'
          });
          this.btnLoadingD = false;
        })
      },
      deleteT() {
        this.$confirm('确定删除该帖吗?', '删除帖子', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoadingD = true;
          let params = {}
          params.id = this.detailSupport.id
          httpAjax('helpContent/delete', params).then(res => {
            if (res.result == "success") {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              //  scrollLeft('#table-wrap')
              this.getVmList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnLoadingD = false;
            this.dialogFormVisibleSyn = false;
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
      handleCommand(command) {
        if (command) {
          this.commandName = command.cateName
        } else {
          this.commandName = '全部'
        }
        this.getVmList(command.id, 1)
      },
      saveReply() {
        let para = {
          id: this.detailSupport.id,
          infoContent: this.infoContent,
          createUser: sessionStorage.getItem('username')
        }
        this.btnLoading = true;
        httpAjax('helpContent/saveReply', para).then(res => {
          // if (res.id) {
          this.infoContent = ''
          this.$message({
            type: 'success',
            message: '回复成功!'
          });
          this.relpyCurr = 1;
          let param = {
            helpId: this.detailSupport.id,
            curr: this.relpyCurr
          }
          httpAjax('helpContent/findReply', param).then(res => {
            this.replyList = res.data;
            this.replyCount = res.count;
            this.$refs['myScrollbar'].wrap.scrollTop = 0;
          });
          this.btnLoading = false;
        }).catch(() => {
          this.btnLoading = false;
        })
      },
    //   goTo() {
    //     this.$refs['myScrollbar'].wrap.scrollTop = document.querySelector('#replayC').offsetTop;
    //     // this.$refs.myScrollbar.scrollTo($('#replayC').offset().top)
    //     //  document.querySelector('.el-scrollbar__view').scrollTo($('#replayC').offset().top)
    //   },
      goto(type) { //先获取指定位置的offsetTop
        let final = this.$refs[type].offsetTop;
        // console.log(final)
        this.smoothUp(final)
        // console.log(this.$refs.myQuillEditor)
        // this.$refs.myQuillEditor.quill.focus();
      },
      smoothUp(final) { //然后通过speed来设置平滑速度,requestAnimationFrame保证流畅度
        let now = this.$refs['myScrollbar'].wrap.scrollTop;
        let speed = Math.floor((now - final) / 8);
        this.$refs['myScrollbar'].wrap.scrollTop -= speed;

        if (now - final > 468 || final - now > 468) {
            this.rqa = window.requestAnimationFrame(this.smoothUp.bind(this, final));
        } else {
            // console.log(now - final)
          window.cancelAnimationFrame(this.rqa);
        this.$refs.myQuillEditor.quill.focus();         
        }
      },
      //   filterTag(value, row) {
      //     this.rowCount++;
      //     if (this.rowCount === this.tableData.length) {

      //       this.getVmList(value).then(() => {
      //         return true
      //         this.rowCount = 0;
      //         // return row.cateName === value;
      //       })

      //     }
      //   },
      updateDesk() { //发布新帖
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          addQuillTitle();
        })
      },
      openDetail(data) { //点开帖子
        // console.log()
        this.detailSupport = data
        let para = {
          helpId: data.id,
          curr: this.relpyCurr
        }
        httpAjax('helpContent/findReply', para).then(res => {
          this.replyList = res.data;
          this.replyCount = res.count;
          this.dialogFormVisibleSyn = true;
          this.$nextTick(() => {
            addQuillTitle();
          })
        });
      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            this.aform = {
              cpu: '',
              memory: '',
              specDes: ''
            }
            this.$refs['aform'].resetFields();
            break;
          case 'detailS':
            this.detailSupport = {}
            this.replyList = []
            this.$refs['myScrollbar'].wrap.scrollTop = 0;
            window.cancelAnimationFrame(this.rqa);
            this.rqa  = null;
          default:
            break;
        }
      },
      addAccount(formName) { //发表帖子
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('helpContent/add', f).then(res => {
              if (res.id) {
                this.$message({
                  type: 'success',
                  message: '发布成功!'
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
                  message: '发布失败!'
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
      getSelectData() {
        httpGet('helpCate/list').then((res) => {
          this.SelectData = res.data;
          //   this.getStatistics()
        }).catch((error) => {
          console.log(error)
        })
      },
      freshCate(){
        //   console.log(1)
          this.getSelectData();
      },
      getVmList(type, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          cateId: type ? type : '',
          infoTitle: this.applyUser
          //   user: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `helpContent/list?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableData = res.data;
          this.tableHeight = computedTableHeight()
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
          if (this.$route.query.id) {
            this.openDetail(this.$store.state.formData)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChangeRE(val) {
        this.relpyCurr = val;
        let param = {
          helpId: this.detailSupport.id,
          curr: this.relpyCurr,
          page: this.relpyCurr
        }
        httpAjax('helpContent/findReply', param).then(res => {
          this.replyList = res.data;
          this.replyCount = res.count;
          this.$refs['myScrollbar'].wrap.scrollTop = 0;
        });
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

  #userHelpList .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  .dialog-footer {
    margin-top: 30px;
    text-align: center;
  }

  .articleContainer {
    display: flex;
    min-height: 300px;
    /* border-top: 1px solid gainsboro; */
    border-bottom: 2px solid gainsboro;
  }

  .articleContainerR {
    display: flex;
    min-height: 300px;
    border-bottom: 1px solid gainsboro;
  }

  .articleTitleP {
    position: relative;
  }

  .articleTitleP::before {
    /* display: block; */
    position: absolute;
    top: -45px;
    right: -35px;
    content: '';
    transform: rotate(225deg);
    border-width: 35px;
    border-style: solid;
    border-color: #20a0ff transparent transparent transparent;
  }

  .articleTitleP::after {
    /* display: block; */
    position: absolute;
    top: 4px;
    right: 0px;
    content: '楼主';
    transform: rotate(45deg);
    font-size: 14px;
    color: white;
  }

  .articleTitle {
    flex: 0 0 120px;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    background: #f5f3f3
  }

  .articleUser {
    color: orange;
    font-size: 18px;
    margin-top: 10px;
    max-width: 120px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .articleContent {
    font-size: 16px;
    padding: 20px;
    line-height: 20px;
  }

  .articleRight {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .articleTime {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 40px;
  }

  .articleGrey {
    margin-right: 10px;
    color: #b9b3b3;
  }

  #menuList123 {
    height: calc(100vh - 120px);
  }

</style>
<style>
  .replayDia .el-dialog__body {
    padding: 10px 20px 30px;
    border-top: 1px solid gainsboro;
  }

  .ql-toolbar.ql-snow {
    line-height: 24px;
  }

</style>
