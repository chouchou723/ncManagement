<template>
  <div id="login" v-loading="loading2" element-loading-text="正在登录中, 请稍后..."
    element-loading-background="rgba(0, 0, 0, 0.6)" customClass="loginL">
    <!-- <div class="login-banner-box" ref="bannerbox">
      <div ref="bannerWrap" class="clearfix" style="height:100%;position: relative;">
        <div class="banner fl">
          <img src="../../src/assets/img/banner1.png" alt="">
        </div>
        <div class="banner fl">
          <img src="../../src/assets/img/banner2.png" alt="">
        </div>
      </div>
    </div> -->
    <div class="login-open">
      <div class="login-welcome-left" :class="{'no-notice':!noticeData.length}">
        <div class="login-welcome" v-if="!noticeData.length">Welcome</div>
        <div class="loagin-notice" v-if="noticeData.length">
          <p class="notice-title">公告</p>
          <ul class="list">
            <li v-for="(item,index) in noticeData" :key="index" class="flexcenter">
              <i class="iconfont icon-tongzhi"></i><a @click="openNoticeDetails(item)">{{item.noticeTitle}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="login-form">
        <div class="form-container">
            <div class="passLogin">密码登录</div>
          <!-- <ul class="list clearfix">
            <li class="fl" :class="{'login-this-active':currentActive == 0}" @click="switchLoginState(0)">
              <el-radio v-model="single" label="sin" class="fz16">密码登录</el-radio>
            </li>
            <li class="fl" :class="{'login-this-active':currentActive == 1}" @click="switchLoginState(1)">
              <el-radio v-model="single" label="two" class="fz16">系统登录</el-radio>
            </li>
          </ul> -->
          <form action="">
            <div class="login-form-domain" style="display:none;">
              <select>
                <option v-for="(key,index) in domainNameList" :key="index" :value="key">{{key}}</option>
              </select>
            </div>
            <div class="ps-form-item border-bottom">
              <div>
                <i class="iconfont icon-yonghu mr5"></i>
                <input type="text" name="username" v-model="userName" @keydown.enter="submitLogin"
                  placeholder="请输入用户名" />
              </div>
            </div>
            <div class="ps-form-item border-bottom">
              <div>
                <i class="iconfont icon-ziyuanxhdpi mr5"></i>
                <input type="password" placeholder="请输入密码" v-model="passWord" @keydown.enter="submitLogin"
                  name="initialPassword" />
              </div>
            </div>
            <div class="ps-form-item">
              <a @click="resetPass= true" class="forgetP">密码重置</a>
            </div>
            <!-- <div style="color:#f10000" align="left" id="errorMsg"></div> -->
            <el-button type="primary" @keydown.enter="submitLogin" @click="submitLogin" class="fz16"
              style="width:260px;margin-top:10px;">登录</el-button>
          </form>
        </div>
      </div>
    </div>
    <el-dialog title="密码重置" :visible.sync="resetPass" :close-on-click-modal="no" custom-class='accountManageDialog'
      top='15%' width="35%" @close='resetD("dform")'>
      <el-form :model="dform" :rules="ruled" ref="dform">
        <el-form-item label="登录帐号:" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model="dform.name" placeholder='请输入帐号' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="tenantDomain" required>
          <el-input v-model="dform.tenantDomain" placeholder='请输入邮箱' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="forgetPass('dform')">确 定</el-button>
        <el-button @click="resetPass = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="model2" :title="noticeDataList.noticeTitle" top="10%" width="60%"
      custom-class='noticeTitle'>
      <!-- <p slot="header">
        <span style="font-size:18px">{{noticeDataList.noticeTitle}}</span>
      </p> -->
      <!-- <h4 class="ps-title">{{noticeDataList.noticeTitle}}</h4> -->
      <p class="ps-notice-content">{{noticeDataList.noticeContent}}</p>
    </el-dialog>
  </div>
</template>

<script>
  import {
    httpAjax
  } from 'api/common'
//   import psloading from './loading'
  export default {
    data() {
      return {
        btnLoading: false,
        loading2: false,
        text: '正在登录中, 请稍后...',
        noticeData: [],
        domainNameList: [],
        currentActive: 0,
        resetPass: false,
        userName: '',
        passWord: '',
        model2: false,
        noticeDataList: '',
        loadingState: false,
        single: 'sin',
        singleTwo: false,
        formLabelWidth: '110px',
        inputLabelWidth: '300px',
        no: false,
        dform: {
          name: '',
          tenantDomain: ''
        },
        ruled: {
          name: [{
            required: true,
            message: '请输入帐号',
            // validator: nan16,
            trigger: 'blur'
          }],
          tenantDomain: [{
            required: true,
            message: '请输入邮箱',
            // validator: nan32,
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      this.getNoticeData()
      this.domainName()
    },
    mounted() {
      // this.bannerMove();
    },
    methods: {
      resetD() {
        this.dform = {
          name: '',
          tenantDomain: ''
        }
        this.$refs.dform.resetFields();
      },
      forgetPass(form) {
        this.$refs[form].validate((valid) => {
          let params = {
            ...this.dform
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('user/resetPassword', params).then(res => {
              this.resetPass = false;
              this.btnLoading = false;
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: '重置成功!'
                });
                // this.$alert('请在我的订单中查看审批结果!', '充值密码', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                //     // this.multSelection = []
                //     this.getVmList()
                //   }
                // });
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc
                });
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '请求无法访问!'
              });
              this.resetPass = false;
              this.btnLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    //   bannerMove() {
    //     var main = this.$refs.bannerWrap
    //     var banner = main.children
    //     var timer = null;
    //     var wd = document.documentElement.clientWidth
    //     main.style.width = 3 * wd + 'px'
    //     var num = 0
    //     for (var i = 0; i < banner.length; i++) {
    //       banner[i].style.width = wd + 'px';
    //     }
    //     var cloneNodes = banner[0].cloneNode(true)
    //     main.appendChild(cloneNodes)
    //     var count = 0;
    //     var self = this

    //     function moveFn() {
    //       if (count == 3) {
    //         main.style.left = 0 + 'px';
    //         count = 1;
    //       }
    //       $(main).stop(true).animate({
    //         'left': -count * wd + 'px'
    //       }, 4000);
    //     }
    //     timer = setInterval(function () {
    //       count++;
    //       moveFn()
    //     }, 10000);
    //   },
      domainName() {
        const url = 'user/findDomainName'
        httpAjax(url).then((res) => {
          if (res.length) {
            this.domainNameList = res
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getNoticeData() {
        httpAjax(`notice/list`).then((res) => {
          this.noticeData = res.data
        }).catch((err) => {
          this.$notify.error({
            title: '公告模块',
            message: '网络出错,请刷新页面后再访问！'
          })
        })
      },
      switchLoginState(index) {
        this.currentActive = index
        if (index == 0) {
          this.single = 'sin'
        } else {
          this.single = 'two'
        }
        this.userName = ''
        this.passWord = ''
      },
      submitLogin() {
        if (!this.userName || !this.passWord) {
          this.$message.warning('用户名密码不能为空')
          return;
        }
        let params = {}
        // var path = "login"
        // if (this.currentActive) {
        //   params.operatorAccount = this.userName
        //   params.password = this.passWord
        // } else {
        //   path = "domainLogin"
          if (!this.domainNameList.length) {
            this.$message.info('正在连接FA，请稍等!')
            return
          }
          params.name = this.userName
          params.password = this.passWord
        //   params.tenantDomain = this.domainNameList[0]
        // }
        params.domainId = this.domainNameList[0]
        let url = `user/domainLogin`
        this.loading2 = true;
        httpAjax(url, params).then((res) => {
          this.loading2 = false
        //   if (res.resultCode >= 0) {
        //     if (res.resultCode == 0) {
        //       // 用户 
        //       this.$store.commit('SET_TOKEN', '2')
        //     } else {
        //       this.$message.error(res.resultDesc);
        //     }
        //   } else if (res.operatorAccount == 'admin') {
        //     //  系统管理员
        //     this.$store.commit('SET_TOKEN', '0')
        //   } else { //  云管理员 
        //   }
        if(res.resultCode==0){
            this.$store.commit('SET_TOKEN', res.role)
          sessionStorage.setItem('username', this.userName);
          sessionStorage.setItem('password', this.passWord);
          sessionStorage.setItem('domain', this.domainNameList[0]);
          this.$router.push({
            path: '/dashboard'
          })

        }
          // clearInterval(timer)  // 关闭banner 定时器
        }).catch((err) => {
          this.loading2 = false
          console.log(err)
        })
      },
      openNoticeDetails(item) {
        this.model2 = true
        this.noticeDataList = item
      }
    },
    // components: {
    //   psloading
    // }
  }

</script>

<style>
  #login{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: url('../../assets/img/banner1.png') no-repeat;
  }

  /* .banner {
    height: 100%;
  } */

 

  /* .login-open .list {
    font: 14px '微软雅黑';
  } */
 .login-open {
    display: flex;
    width: 700px;
    height: 350px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #fff;
  }
  .login-open .list li {
    width: 320px;
    margin: 0 auto;
    line-height: 30px;
    padding-left: 20px;
   
  }

  .login-open .list li a {
    padding-left: 5px;
    color: #fff;
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
   .notice-title {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 23px;
  }
 /* .login-open .list li a:hover{
     cursor: pointer;
 } */
  .flexcenter {
    display: flex;
    align-items: center;
  }

  .fz16 {
    font-size: 16px;
  }

  .mr5 {
    margin-right: 5px;
  }

 

  .login-welcome-left {
    flex: 1;
    display: flex;
    font-size: 24px;
  }

  .login-form {
    flex: 1;
  }

  .loagin-notice {
    width: 100%;
    font-size: 15px;
  }

  .no-notice {
    align-items: center;
    justify-content: center;
  }

  .form-container {
    width: 260px;
    margin: 0 auto;
    margin-top: 30px;
  }
.passLogin{
    font-size: 21px;
    margin-bottom: 10px;
}
  .form-container .list li {
    width: 50%;
    padding: 5px 0px;
    text-align: center;
    color: #fff;
    border-bottom: 2px solid #fff;
  }

  .form-container a {
    color: #fff;
    display: block;
    width: 100%;
  }

  .login-form input {
    border-style: none;
    color: #fff;
    background: rgba(0, 0, 0, 0);
    font-size: 16px;
    width: 85%;
  }

  .login-form .ps-form-item {
    padding-bottom: 10px;
    padding-top: 25px;
  }

  .border-bottom {
    border-bottom: 1px solid #fff;
  }

  .login-this-active {
    border-bottom: 2px solid #2b85e4 !important;
  }

  .el-radio {
    color: #fff;
  }

  /* .login-open .ivu-btn-primary {
    width: 100%;
    margin-top: 10px;
  }

  .login-modal-main .ivu-input-wrapper {
    width: 70%;
  }

  .ps-btn-none .ivu-modal-header,
  .ps-btn-none .ivu-modal-body .ps-title {
    text-align: center;
  }

  .ps-small-width .ivu-modal-content {
    width: 100%;
    height: 160px;
  }

  .ps-big-width .ivu-modal-content {
    width: 100%;
    height: 500px;
  } */

  /* .ps-title {
    padding: 10px 0;
  } */

  .ps-notice-content {
    line-height: 30px;
    text-indent: 2em;
    min-height: 300px;
  }

  .loagin-notice .icon-announcement {
    font-size: 20px;
    display: inline-block;
    transform: rotate(180deg);
    vertical-align: -3px;
  }

  /* .loagin-notice a,
  .ps-title,
  .ps-notice-content {
    font-size: 15px;
  } */

  /* .login-form .ivu-btn {
    padding: 8px 15px;
  } */

  .loagin-notice a:hover {
    text-decoration: underline;
     cursor: pointer;
  }

  #login .el-dialog__header {
    text-align: center;
  }
.forgetP{
    text-align:right;
    font-size: 14px;
}
.forgetP:hover{
    cursor: pointer;
}
  .noticeTitle .el-dialog__title {
    font-weight: 600
  }

</style>
