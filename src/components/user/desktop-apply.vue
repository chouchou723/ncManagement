<template>
  <div id="desktop-apply"  element-loading-text="正在提交 , 请稍后...">
    <div class="search-wrap">
      <el-input placeholder="请输入桌面名称" style="width:185px;" v-model="name" clearable @keyup.enter.native="searchData"
        @clear="searchData" />
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <!-- <span class="hint">请点击以下桌面进行申请</span> -->
      <span class="fr">
        <span><i class="iconfont icon-liebiao1" :style="{color:displayType==='one'?'rgb(64, 158, 255)':''}"
            @click="changeType(1)"></i></span>
        <span><i class="el-icon-menu"
            :style="displayType==='mul'?'color:rgb(64, 158, 255);font-size:23px;':'font-size:23px;'"
            @click="changeType(2)"></i></span>
      </span>
    </div>
    <div class="user-commodity-list-main table-wrap">
      <ul class="list" id="commodity-main">
        <el-card class="pcItem" @click.native="applyDesktop(item)" v-for="(item,index) in commodityData" :key="index"
          shadow="hover" v-show="displayType==='mul'">
          <div class="cardTitle">
            <img src="../../assets/img/llgg.png" class="image" width="80" height="80">
            <div style="display:flex;flex-direction:column">
              <el-popover placement="right" width="250" trigger="hover">
                <div class="cardContent">
                  <span class="cardpadding"><span class="fw600">桌面名称：</span>{{item.name}}</span>
                  <span class="cardpadding"><span class="fw600">桌面命名后缀：</span>{{item.postfix||'暂无'}}</span>
                  <span class="cardpadding"><span class="fw600">云管理员：</span>{{item.operatorAccount}}</span>
                  <span class="cardpadding"><span class="fw600">IP分配方式：</span>{{item.ipDistri||'0.0.0.0'}}</span>
                  <span class="cardpadding"><span class="fw600">子网掩码：</span>{{item.subnetMask||'0.0.0.0'}}</span>
                  <span class="cardpadding"><span class="fw600">网关：</span>{{item.gateway||'0.0.0.0'}}</span>
                  <span class="cardpadding"><span class="fw600">DNS服务器：</span>{{item.dnsServer||'0.0.0.0'}}</span>
                  <span class="cardpadding"><span
                      class="fw600">描述：</span>{{item.description||'暂无'}}</span>
                </div>
                <el-button slot="reference" type="text" class="pctitle" >{{item.name}}<i class="el-icon-info el-icon--right"></i>
                </el-button>
              </el-popover>
              <div style="font-size: 14px;color: grey;margin-left: 10px">
                ({{item.approval==='false'?'无需管理员审批':'需要管理员审批'}})
              </div>
            </div>
          </div>
          <div class="flexspace">
            <el-progress type="circle" :percentage="parseInt((item.cpu/16)*100)" status="text" width="90">
              <div style="margin-bottom:5px;">CPU</div>
              <div>{{ item.cpu }}核</div>
            </el-progress>
            <el-progress type="circle" :percentage="parseInt((item.memory/32)*100)" status="text" width="90"
              color="#ff8600">
              <div style="margin-bottom:5px;">内存</div>
              <div>{{ item.memory }}G</div>
            </el-progress>
            <el-progress type="circle" :percentage="parseInt(((item.disk+item.sysDisk)/1024)*100)" status="text" width="90"
              color="#42b983">
              <div style="margin-bottom:5px;">磁盘</div>
              <div>{{ (item.disk+item.sysDisk) }}G</div>
            </el-progress>
          </div>
        </el-card>
        <li class="li-item" @click="applyDesktop(item)" v-for="(item,index) in commodityData" :key="index"
          v-show="displayType==='one'">
          <div class="title">
            <img src="../../assets/img/Linux.png" alt="">
            <div>
              <p class="client-name">桌面名称 : <span>{{item.name}}</span></p>
              <p class="tenant-name">云管理员 : <span>{{item.operatorAccount}}</span></p>
            </div>
          </div>
          <div class="modalDes">
            <span v-if="item.cpu" class="ed">CPU:{{ item.cpu }}核</span>
            <span v-if="item.memory" class="ed">内存：{{item.memory }}G</span>
            <span v-if="(item.disk+item.sysDisk)" class="ed">磁盘:{{(item.disk+item.sysDisk) }}G</span>
            <span v-if="item.ipDistri" class="ed">IP分配方式：{{item.ipDistri}}</span>
            <span v-if="item.subnetMask" class="ed">子网掩码:{{item.subnetMask}}</span>
            <span v-if="item.gateway" class="ed">网关:{{item.gateway}}</span>
            <span v-if="item.dnsServer" class="ed">DNS服务器:{{item.dnsServer}}</span>
            <span v-if="item.postfix" class="ed">桌面命名后缀:{{item.postfix}}</span>
          </div>
          <p class="content-message">描述 : {{item.description||'暂无'}},{{item.approval==='false'?'无需管理员审批':'需要管理员审批'}}</p>
        </li>
      </ul>
      <!-- <ul class="list" id="commodity-main" v-show="displayType==='one'">
      </ul> -->
    </div>
    <!-- 桌面申请 -->
    <el-dialog title="桌面申请" :visible.sync="modalState" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='5%' width="40%" @close='resetD("params")'>
      <el-form :model="params" :rules="rules2" ref="params">
        <el-form-item label="桌面名称:" :label-width="formLabelWidth" prop="name">
          <span>{{Tname.name}}</span>
        </el-form-item>
        <el-form-item label="桌面命名后缀:" :label-width="formLabelWidth" prop="postfix" v-if="Tname.postfix">
          <span>{{Tname.postfix}}</span>
        </el-form-item>
        <el-form-item label="桌面规格:" :label-width="formLabelWidth" prop="name">
          <span>{{Tname.cpu}}核/{{Tname.memory}}GB/{{Tname.disk+Tname.sysDisk}}GB</span>
        </el-form-item>
        <el-form-item label="所属管理员:" :label-width="formLabelWidth" prop="name">
          <span>{{Tname.operatorAccount}}</span>
        </el-form-item>
        <el-form-item label="审批规则:" :label-width="formLabelWidth" prop="name">
          <span>{{Tname.approval==='false'?'无需管理员审批':'需要管理员审批'}}</span><span style="color:red" v-if="Tname.approval==='false'">(剩余申请次数{{approvalNum}}次)</span>
        </el-form-item>
        <el-form-item label="有效期:" :label-width="formLabelWidth" prop="deadline">
          <el-date-picker v-model="params.deadline" value-format="yyyy-MM-dd" type="date" placeholder="请选择有效期"
            :editable="no" :picker-options="pickerOptions2">
          </el-date-picker>
          <div class="psHint">
            <div>注1：如有效期为空，则无限期使用。
            </div>
            <div>注2：如果设置有效期，到期后桌面资源会自动清退释放。</div>
          </div>
        </el-form-item>
        <el-form-item label="用途:" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="params.description" :autosize="{minRows: 6, maxRows: 6 }"
            placeholder='请输入用途,最多255个字' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <el-form-item label="代申请:" :label-width="formLabelWidth" prop="applyState">
          <el-switch v-model="applyState" active-color="#13ce66" inactive-color="#d2d2d2" @change='clearName'>
          </el-switch>
        </el-form-item>
        <el-form-item v-show="applyState" label="" :label-width="formLabelWidth">
          <div>
            <el-input style="width:180px;" v-model="params.agentName" placeholder="请输入代申请人名称" />
            <el-button type="ghost" @click="queryUserList"><i class="el-icon-search"></i>查询</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="(applyState&&!params.agentName)||(Tname.approval==='false'&&approvalNum===0)" @click="applySubmitBtn('params')" :loading="loadingState">确 定
        </el-button>
        <el-button @click="modalState = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 待申请  -->
    <el-dialog title="选择代申请人" :visible.sync="modalState1" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='8%' @close='resetD("b")'>
      <h4 slot="header">选择代申请人</h4>
      <div class="search-wrap">
        <el-input placeholder="请输入代申请人名称" v-model="queryUserName" style="width:185px;" clearable
          @keyup.enter.native="queryUserList('',1)" @clear="queryUserList('',1)" />
        <el-button type="ghost" @click="queryUserList('',1)"><i class="el-icon-search"></i>查询</el-button>
        <!-- <el-button type="primary" @click="serviceConfirm">确定</el-button> -->
      </div>
      <div class="table-wrap" id="table-wrap">
        <el-table :data="userListData" height="260" ref="multipleTable" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClick" @select="checkSelect"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="申请人">
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListData.length">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
        <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="serviceConfirm">确 定</el-button>
        <el-button @click="modalState1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <psloading v-show="loadingState" text="正在提交 , 请稍后...."></psloading> -->
  </div>
</template>

<script>
  import {
    httpAjax,
    httpGet,
    addScrollBar,
    // minTime
  } from 'api/common'
  // import psloading from '../loading'
  export default {
    data() {
      return {
          approvalNum:0,
        approval: 'true',
        name: '',
        no: false,
        displayType: 'mul',
        commodityData: [],
        modalState: false,
        modalState1: false,
        Tname: '',
        loadingState: false,
        queryUserName: '', //  查询用户名
        // minTime,
        // cloneDeadline: '',
        params: {
          id: '', //  对应商品的 ID
          dealPerson: '', //  对应商品所属云管理员账号
          deadline: '', //  商品有效期
          agentName: '', //  使用人名称
          description: '' //  商品用途
        },
        // rules2:{
        //    cpu: [{
        //     required: true,
        //     validator: nan16,
        //     trigger: 'blur'
        //   }],
        // },
        count: 0,
        formLabelWidth: '110px',
        inputLabelWidth: '300px',
        userListData: [],
        // userConfigInfo: this.getUserConfig(),
        applyState: false,
        tableChecked: [],
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        currentPage4: 1,
        currentSize: 10,
        showcontent: true,
      }
    },
    created() {
      this.getCommodityData()
    },
    methods: {
        getApprovalNum(){
            let url = `user/findDomainUser`
            httpAjax(url,{name:sessionStorage.getItem('username')}).then(res=>{
                // console.log(res)
                this.approvalNum = res.quota - res.usedQuota
            })
        },
      clearName(val) {
        if (!val) {
          this.params.agentName = ''
        }
      },
      // selectionChange(val) {
      //   },
      resetD(name) { //重置表单
        if (name === 'params') {
          this.applyState = false;
          this.params = {
            id: '', //  对应商品的 ID
            dealPerson: '', //  对应商品所属云管理员账号
            deadline: '', //  商品有效期
            agentName: '', //  使用人名称
            description: '' //  商品用途
          }
          this.$refs['params'].resetFields();
        } else {
          this.$refs.multipleTable.toggleRowSelection(this.tableChecked[0]);
          this.tableChecked = [];
          this.currentPage4 = 1;
          this.currentSize = 10;
          this.queryUserName = '';
        }
      },
      rowClick(row, column, event) {
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
      checkSelect(selection, row) { //选待申请人
        if (selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(selection[0]);
        }
        this.tableChecked = selection;
        // console.log(selection, row)
      },
      handleCurrentChange(val) { //翻页
        this.tableChecked = []
        this.currentPage4 = val;
        this.queryUserList()
      },
      handleSizeChange(val) { //切换size
        this.tableChecked = []
        this.currentSize = val;
        this.queryUserList()
      },
      changeType(num) { //改变列表格式
        // this.showcontent = false;
        if (num === 1) {
          this.displayType = 'one'
        } else {
          this.displayType = 'mul'
        }
        // this.$nextTick(()=>{
        //     this.setScroll('.user-commodity-list-main', true)
        // })
        // setTimeout(()=>{
        //   this.showcontent = true;
        // },300)
      },
      searchData() { //搜索桌面
        this.getCommodityData();
      },
      getCommodityData() { //获取桌面
        let para = {
          name: this.name
        }
        let url = 'merchandise/desktopApplyList?' + Math.random()
        httpAjax(url, para).then((res) => {
          this.commodityData = res;
          this.setScroll('.user-commodity-list-main', true)
        }).catch((err) => {
          console.log(err)
        })
      },
      // timeChange(val) {
      //   var str = val.trim()
      //   if (str != '1970-01-01' && str != '') {
      //     this.params.deadline = val
      //   }
      // },
      // cancelModalOne() {
      //   this.applyState = false
      //   this.cloneDeadline = ''
      //   this.params = {
      //     id: '', //  对应商品的 ID
      //     dealPerson: '', //  对应商品所属云管理员
      //     deadline: '', //  商品有效期
      //     agentName: '', //  使用人名称
      //     description: '' //  商品用途
      //   }
      // },
      applyDesktop(item) { //打开桌面申请
      this.getApprovalNum();
        this.params.id = item.id,
          this.params.dealPerson = item.operatorAccount
        this.Tname = item;
        // console.log(this.Tname)
        // this.approval = item.approval;
        this.modalState = true
      },

      queryUserList(first, page) { //查询待申请人
        // var page = typeof num == 'number' ? num : 1;
        page ? this.currentPage4 = page : '';
        var params = {
          name: this.queryUserName,
          page: this.currentPage4,
          limit: this.currentSize,
          role: 'user'
        }
        let url = `user/userList`
        this.modalState1 = true
        httpAjax(url, params).then((res) => {
          this.userListData = res.data
          this.count = res.count
          this.$nextTick(() => {
            this.setScroll('#table-wrap', true)
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // handleCurrentChange(val) {
      //   this.queryUserList(val)
      // },
      // getUserConfig() {
      //   return [{
      //       type: 'selection',
      //       width: 60
      //     },
      //     {
      //       title: '申请人',
      //       key: 'name'
      //     },
      //   ]
      // },
      applySubmitBtn(formName) { //提交表单
        var params = this.params
        if (this.applyState && params.agentName) {
          var url = 'user/findTenantOnAD'
          params.name = params.agentName
          httpAjax(url, params).then((res) => {
            if (res.resultCode == 1) {
              this.saveOrder(params);
            } else {
              this.$message.warning({
                title: '提示',
                message: '待申请人名称不存在,请确认后在提交'
              })
            }
          }).catch((err) => {
            this.$message.error({
              title: '提示',
              message: '网络错误,请刷新页面再试'
            })
          })
        } else {
          params.name = ''
          params.agentName = ''
          this.saveOrder(params);
        }
      },
      saveOrder(params) { //提交表单
        this.loadingState = true
        const url = 'desktop/saveOrder'
        httpAjax(url, params).then((res) => {
          this.loadingState = false
          if (res.result == 'success') {
            this.modalState = false;
            this.getCommodityData()
            this.$confirm('桌面申请成功', '提示', {
              confirmButtonText: '查看申请状态',
              cancelButtonText: '继续申请',
              type: 'success'
            }).then(() => {
              this.$router.push('myOrder')
            }).catch(() => {
              this.modalState = false
            });
          }else{
             this.$message({
                    type: 'error',
                    message: res.desc||'申请失败!'
                  });
          }
        }).catch((err) => {
          this.$message.error('通信错误')
          this.loadingState = false
        })
      },

      serviceConfirm() { //代申请人确认
        // var len = this.tableChecked.length
        // if (len >= 2 || len < 1) {
        //   var title = len < 1 ? '请选择一位待申请人' : '只能选择一位待申请人'
        //   this.$message.warning({
        //     message: title
        //   })

        //   return
        // } else {
        //   }
        this.params.agentName = this.tableChecked[0].name
        // console.log( this.params.agentName)
        this.modalState1 = false
      },
      setScroll(node, bool) {
        addScrollBar(node, bool)
      }
    },
    // components: {
    //   psloading
    // }
  }

</script>

<style scoped>
  .search-wrap {
    padding-right: 10px;
  }

  .search-wrap .fr {
    margin-top: 6px;
    display: flex;
  }

  .search-wrap .fr i {
    font-size: 22px;
    cursor: pointer;
    /* vertical-align: middle; */
  }

  .user-commodity-list-main {
    background: #fff;
    height: 89%;
    /* margin-top: 15px; */
  }

  .list {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .li-item {
    border: 1px solid #EBEEF5;
    overflow: hidden;
    padding: 20px;
    border-radius: 4px;
    width: 95%;
    /* height: 200px; */
    margin-bottom: 15px;
    cursor: pointer;
    transition: all .5s;
    color: #495060;
  }

  .pcItem {
    width: 340px;
    height: 225px;
    position: relative;
    /* background: url('../../../static/img/pc.svg')  no-repeat center/100% 100%; */
    margin: 0 25px 20px 0;
    cursor: pointer;
  }

  .pcItem::before {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    content: '';
    transform: rotate(360deg);
    /* border-width: 45px;
    border-style: solid;
    border-color: #20a0ff transparent transparent transparent; */
    border-color: transparent;
    border-style: solid;
    border-width: 0 55px 55px;
    border-right-color: #20a0ff;
  }

  .pcItem::after {
    display: block;
    position: absolute;
    top: 6px;
    right: 2px;
    content: '申请';
    transform: rotate(45deg);
    font-size: 18px;
    color: white;
  }

  .cardTitle {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
  }

  .cardContent {
    display: flex;
    flex-direction: column;
    font-size: 14px
  }

  .cardpadding {
    padding: 0 5px 10px;
  }

  .fw600 {
    font-weight: 600
  }

  .flexspace {
    display: flex;
    justify-content: space-between;
  }

  .pctitle {
    font-size: 18px;
    color: grey;
    margin-left: 10px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  /* .pcName{
  position: absolute;
  width: 80%;
  text-align: center;
  transform: translateX(-50%);
  top:35px;
  left:50%;
  color:white;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
} */
  /* .pcContent{
  position: absolute;
  width: 68%;
  height:55%;
  transform: translateX(-50%);
  top:53px;
  left:50%;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 15px;
  background: #4c4c4c;
  color:white;
} */
  /* .pcMemo{
  flex:1;
} */
  /* .pcItem:hover .pcContent{
  background: #00ff00;
  color: black;
}
.pcItem:hover .openIcon{
  position:absolute;
  width: 15%;
  height:11px;
  transform: translateX(-50%);
  top:230px;
  left:50%;
   background: #00ff00;
} */
  /* .tag{
  position: absolute;
  width: 50px;
  top:222px;
  left:60px;
  font-size: 20px;

} */
  .title {
    display: flex;
  }

  .title img {
    width: 70px;
    height: 70px;
    margin-right: 20px;
    border-radius: 10px
  }

  .client-name {
    margin-top: 10px;

  }

  .tenant-name {
    margin-top: 10px;
    /* color: #296683; */
  }

  /* .number-value {
    padding: 12px 0;
  }

  .number-value span {
    padding: 0 20px 0px 5px;
  } */

  .content-message {
    line-height: 32px;
    margin-top: 10px;
    padding: 0 5px;
  }

  /* 
  .ivu-form-item {
    margin-bottom: 15px;
  }

  .ivu-date-picker {
    display: block;
  } */

  .li-item:hover {
    /* box-shadow: 5px 5px 30px rgb(89, 121, 160);
     */
    box-shadow: 0 0 20px rgba(0, 0, 0, .2);

  }

  .page-wrap {
    text-align: center;
  }

  /* .li-item::after {
      content: '';
      position: absolute;
      z-index: -1;
      opacity: 0;
      box-shadow: 0 5px 15px rgba(65, 96, 212, 0.7);
      transition: opacity 1s ease-in-out;
    } 
    .li-item:hover::after {
    	opacity: 1;
    }
    .li-item{
        position: relative;
        background-color: #fff;
        -webkit-transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
        transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .li-item::after {
      content: "";
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0);
      opacity: 0;
      -webkit-transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
      transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .li-item:hover::after {
        opacity: 1;
    } */
  /* .hint {
    display: inline-block;
    margin-left: 14px;
    padding: 5px 10px;
    background: #FFB800;
    color: #fff;
    border-radius: 4px;
  } */

  .psHint {
    color: red;
    text-align: left;
    /* margin-left: 70px; */
    font-size: 12px;
    line-height: 20px;
  }

  .modalDes {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    padding: 0 5px;
    flex-wrap: wrap;
  }

  .ed {
    margin-right: 30px;
    line-height: 30px;
  }

</style>
