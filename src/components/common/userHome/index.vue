<template>
  <div class="dashboard-editor-container">
    <!-- <h3 style="position: absolute;top: 5%;left: 2%;font-size: 30px;color: #666;">快捷菜单</h3> -->
    <el-carousel style="height:100%" indicator-position='outside' :autoplay='false'>
      <el-carousel-item>

        <div style="height:100%;padding:0 10%;display:flex;align-items:center;">
          <panel-group @handleSetLineChartData="handleSetLineChartData" />
        </div>

      </el-carousel-item>
      <el-carousel-item style="display:flex;align-items:center;">
        <el-row style="display:flex;align-items:center;height:66%;width: 100%;padding: 0 10%;justify-content:space-between">

          <div class="chart-wrapper">
            <div class="chartTitle">
              <h3>温馨提示</h3>
            </div>
            <div v-for="(item,index) in noticeData" :key="index" class="flexcenter">
              <i class="iconfont icon-tongzhi"></i><a @click="openNoticeDetails(item)">{{item.noticeTitle}}</a>
            </div>
          </div>


          <div class="chart-wrapper" style="margin: 0 30px;">
            <div class="chartTitle">
              <h3>最新热帖</h3>
              <div class="seemore" @click="gotoMore('/userHelpList')">more</div>
            </div>
            <div v-for="(item,index) in tableData" :key="index" class="flexcenter">
              <a @click="openTableDetails(item)">
                <span style="margin-right:10px;color:#7a8e96">[{{item.cateName}}]</span>{{item.infoTitle}}</a>
            </div>
          </div>


          <div class="chart-wrapper">
            <div class="chartTitle">
              <h3>故障报修单</h3>
              <div class="seemore" @click="gotoMore('/userOnlineSupport')">more</div>
            </div>
            <div v-for="(item,index) in problemData" :key="index" class="flexcenter">
              <a @click="openProblemDetails(item)">
                <span
                  :style="item.processor?'margin-right:10px;color:#42b983':'margin-right:10px;color:#d83232'">[{{item.processor?'已处理':'未处理'}}]</span>{{item.title}}</a>
            </div>

          </div>

        </el-row>
      </el-carousel-item>
    </el-carousel>
    <!-- <h3 class="hidden-md-and-down" style="color: #666;font-size: 23px;margin: 22px 0;">快捷菜单</h3> -->
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chartTitle">
            <h3>温馨提示</h3>
          </div>
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
          <div v-for="(item,index) in tableData" :key="index" class="flexcenter">
            <a @click="openTableDetails(item)">
              <span style="margin-right:10px;color:#7a8e96">[{{item.cateName}}]</span>{{item.infoTitle}}</a>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chartTitle">
            <h3>故障报修单</h3>
            <div class="seemore" @click="gotoMore('/userOnlineSupport')">more</div>
          </div>
          <div v-for="(item,index) in problemData" :key="index" class="flexcenter">
            <a @click="openProblemDetails(item)">
              <span
                :style="item.processor?'margin-right:10px;color:#42b983':'margin-right:10px;color:#d83232'">[{{item.processor?'已处理':'未处理'}}]</span>{{item.title}}</a>
          </div>

        </div>
      </el-col>
    </el-row> -->
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
    <el-dialog title="故障详情" :visible.sync="modelProblem" custom-class='accountManageDialog' top='7%' width="40%">
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
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
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
        detailSupport: {},
      }
    },
    created() {
      this.getNoticeData();
      this.getHelpList();
      this.getProblemList();
    },
    methods: {
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
<style>
  .el-carousel__container {
    height: 90%;
    margin-top: 2%;
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 0;
    // background-color: rgb(240, 242, 245);
    height: 99%;
    position: relative;
      background: #fff;
    .chart-wrapper {
      box-sizing: border-box;
      color: #666;
      background: #fff;
      padding: 15px 20px;
      height: 100%;
      //   margin-bottom: 32px;
      flex: 0 0 30%;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: 2px 2px 20px rgba(0,0,0,0.3);
      transition: all 0.2s linear;
    //   border-color: rgba(0, 0, 0, .1);
    &:hover{
      box-shadow: 2px 2px 40px rgba(0,0,0,0.3);

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
    font-size: 16px;
    // margin-bottom: 5px;

    a {
      width: 90%;
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
    font-size: 20px;
  }

</style>
