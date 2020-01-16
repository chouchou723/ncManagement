<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="40" class="firstPanel">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chartTitle">
            <h3>温馨提示</h3>
          </div>
          <div v-if="noticeData.length===0" style="text-align:center;margin-top: 100px;">暂无公告</div>
          <div v-for="(item,index) in noticeData" :key="index" class="flexcenter">
            <i class="iconfont icon-tongzhi"></i><a @click="openNoticeDetails(item)">{{item.noticeTitle}}</a>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chartTitle">
            <h3>最新热帖</h3>
            <div class="seemore" @click="gotoMore('/userHelpList')">more</div>
          </div>
          <div v-if="tableData.length===0" style="text-align:center;margin-top: 100px;">暂无帖子</div>

          <div v-for="(item,index) in tableData" :key="index" class="flexcenter">
            <a @click="openTableDetails(item)">
              <span style="margin-right:10px;color:#7a8e96">[{{item.cateName}}]</span>{{item.infoTitle}}</a>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" v-if="localRole!=='support'">
        <div class="chart-wrapper">
          <div class="chartTitle">
            <h3>{{localRole==='user'?'我的故障单':'故障报修单'}}</h3>
            <div class="seemore" @click="gotoMore('/userOnlineSupport')">more</div>
          </div>
          <div v-if="problemData.length===0" style="text-align:center;margin-top: 100px;">暂无未处理故障单</div>
          <div v-for="(item,index) in problemData" :key="index" class="flexcenter">
            <a @click="openProblemDetails(item)">
              <span
                :style="item.processor?'margin-right:10px;color:#42b983':'margin-right:10px;color:#d83232'">[{{item.processor?'已处理':'未处理'}}]</span>{{item.title}}</a>
          </div>

        </div>
      </el-col>
    </el-row>
    <!-- 公告详情 -->
    <el-dialog :visible.sync="model2" :title="noticeDataList.noticeTitle" top="10%" width="60%"
      custom-class='noticeTitle'>
      <p class="ps-notice-content">{{noticeDataList.noticeContent}}</p>
    </el-dialog>
    <!-- 帖子详情 -->
    <el-dialog :visible.sync="modeltable" :title="noticeDataList.infoTitle" top="5%" width="65%"
      custom-class='noticeTitle'>
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar">
        <p class="ps-notice-content" v-html="noticeDataList.infoContent"></p>
      </el-scrollbar>
      <div style="text-align: right;margin-top: 20px;margin-right:30px">
        <el-button type="text" @click="gotoList(noticeDataList)">查看原帖</el-button>
      </div>
    </el-dialog>
    <!-- 故障详情 -->
    <el-dialog title="故障详情" :visible.sync="modelProblem" custom-class='accountManageDialog' top='7%' width="40%"  @close="resetD('detailSupport')">
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuListTro" ref="myScrollbarTro">
      
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
          <el-form-item label="问题附件:" :label-width="formLabelWidth" prop="uploadFiles">
            <el-button type="text" @click="getFile" v-if="detailSupport.uploadFiles[0]">
              {{detailSupport.uploadFiles[0].name}}</el-button>
            <div v-else>暂无</div>
          </el-form-item>
        <!-- <el-form-item label="问题附件:" :label-width="formLabelWidth" prop="fa">
          <div>{{sform.title}}</div>
        </el-form-item> -->
        <el-form-item label="解决方案:" :label-width="formLabelWidth" prop="fa">
          <div>{{detailSupport.resolution||'暂无'}}</div>
        </el-form-item>
      </el-form>
      </el-scrollbar>
       <div slot="footer" class="dialog-footer" >
        <el-button type="primary" :loading="btnLoading" @click="addResolution('detailSupport')" v-if="localRole==='troubleshooting'">{{detailSupport.processor?'提 交':'接 收'}}</el-button>
        <el-button @click="modelProblem = false" v-if="localRole==='troubleshooting'">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PanelGroup from './components/panelGroupBack'
  import {
    httpAjax,
    httpGet
  } from 'api/common'
  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup
    },
    data() {
      return {
        model2: false,
        noticeDataList: {},
        noticeData: [],
        tableData: [],
        modeltable: false,
        modelProblem: false,
        problemData: [],
        detailSupport: {processor: '',
          resolution: '',
          uploadFiles: [{
            name: '点击查看'
          }]},
      }
    },
    computed:{
        localRole() {
        return sessionStorage.getItem('role')
      },
      localName() {
        return sessionStorage.getItem('username')
      }
    },
    created() {
      this.getNoticeData();
      this.getHelpList();
      this.getProblemList();
    },
    methods: {
        resetD(formName) {
        switch (formName) {
          case 'detailSupport':
            this.detailSupport = {
              id: '',
              processor: '',
              resolution: '',
              uploadFiles: [{
                name: '点击查看'
              }]
            }
            this.$refs['myScrollbarTro'].wrap.scrollTop = 0;
            break;
          default:
            break;
        }
      },
        addResolution(formName) { //处理故障//接收
           let para = {
              id: this.detailSupport.id,
              processor: this.localName,
            }
              this.btnLoading = true;
              httpAjax('helpContent/updateRepairs', para).then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '接收成功!'
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
                    message: '接收失败!'
                  });
                }
                this.getProblemList()
                this.modelProblem = false;
                this.btnLoading = false;
              }).catch(() => {
                this.btnLoading = false;
              })
      },
        getFile() {
        window.open(`/api/${this.detailSupport.uploadFiles[0].path}`)
      },
      gotoList(data) {
        this.$store.commit('setFormData', data)
        this.$router.push({
          path: '/userHelpList',
          query: {
            id: data.id
          }
        })
      },
      gotoMore(path) { //查看更多跳转
        this.$router.push(path)
      },
      getProblemList() { //获取故障单
        let para = {
          page: 1,
          limit: 10,
          status:'wait'

        }
        const url = `helpContent/repairsList?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.problemData = res.data;
        }).catch((error) => {
          console.log(error)
        })
      },
      getHelpList(type, page) { //获取帖子
        let para = {
          page: 1,
          limit: 10,
          cateId: ''
        }
        const url = `helpContent/list?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableData = res.data.slice(0, 10);
        }).catch((error) => {
          console.log(error)
        })
      },
      openNoticeDetails(item) { //打开公告
        this.model2 = true
        this.noticeDataList = {
          ...item
        }
      },
      openTableDetails(item) { //打开帖子
        this.modeltable = true
        this.noticeDataList = {
          ...item
        }
      },
      openProblemDetails(item) { //打开故障单
        this.modelProblem = true
        this.detailSupport = item
      },
      getNoticeData() { //获取公告
        httpAjax(`notice/list`).then((res) => {
          this.noticeData = res.data.slice(0, 10)
        }).catch((err) => {
          this.$notify.error({
            title: '公告模块',
            message: '网络出错,请刷新页面后再访问！'
          })
        })
      },
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 0px 32px;
    // background-color: rgb(240, 242, 245);
    height: 100%;

    .chart-wrapper {
      color: #666;
      background: #fff;
      padding: 16px 16px;
      margin-bottom: 32px;
      border-radius: 5px;
      transition: all 0.2s linear;

      //   border-color: rgba(0, 0, 0, .1);
      overflow: hidden;
      height: 355px;
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);
// border:1px solid gainsboro;
      border-radius: 5px;
      &:hover {
        box-shadow: 0 0 20px rgba(0, 0, 0, .2);

      }
    }

    .firstPanel {
      margin-top: 35px;border-top: 1px solid gainsboro;padding-top:40px
    }
  }

  @media screen and (max-width: 1280px) {
    .dashboard-editor-container {

      .chart-wrapper {
        height: 242px;
      }

      .firstPanel {
        margin-top: 5px;padding-top:23px
      }
    }
  }

  //   h3 {
  //     margin-bottom: 16px;
  //   }

  .flexcenter {
    display: flex;
    align-items: center;
    height: 30px;

    a {
      //   width: 320px;
      padding-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .ps-notice-content {
    line-height: 30px;
    text-indent: 2em;
    min-height: 300px;
    font-size: 16px;
    padding: 0 20px;
  }

  #menuList123 {
    height: 500px;
  }

  .seemore {
    font-size: 16px;
    color: #2caf94;
    cursor: pointer;
  }

  .chartTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
#menuListTro{
     height: calc(70vh - 120px);
}
</style>
