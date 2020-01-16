<template>
  <div id="login" v-loading="loading2" element-loading-text="正在登录中, 请稍后..."
    element-loading-background="rgba(0, 0, 0, 0.6)" customClass="loginL">
    <!-- <div ref="bannerbox" class="login-banner-box">
      <div ref="bannerWrap" class="clearfix" style="height:100%;position: relative;">
        <div class="banner fl">
          <img src="@/assets/img/banner1.png" alt="">
        </div> -->
    <!-- <div class="banner fl">
          <img src="../../src/assets/img/banner2.png" alt="">
        </div> -->
    <!-- </div>
    </div> -->
    <div class="login-wrap">
      <div class="left-wrap">
        <div class="left-login">
          <img src="../../assets/img/logo1.jpeg" alt="" style="height:200px;">
          <div class='ms-title'>南昌陆院教学管理平台</div>
          <el-form ref="loginForm" :model="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable style="width:360px;" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" clearable style="width:360px;" />
            </el-form-item>
          </el-form>
           <div class="ps-form-item">
            <a @click="userLogin= true">用户注册</a>
          </div>
          <div class="login-btn">
            <el-button type="primary" @click="submitLogin('loginForm')">登录</el-button>
          </div>
        </div>
      </div>
      <div class="right-wrap"></div>
    </div>
    <!-- 密码重置 -->
    <!-- <el-dialog title="密码找回" :visible.sync="resetPass" :close-on-click-modal="no" custom-class="accountManageDialog"
      top="15%" width="35%" @close="resetD('dform')">
      <el-form ref="dform" :model="dform" :rules="ruled">
        <el-form-item label="登录账号:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dform.name" placeholder="请输入账号" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="mail">
          <el-input v-model="dform.mail" placeholder="请输入邮箱" :style="{width:inputLabelWidth}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="forgetPass('dform')">确 定</el-button>
        <el-button @click="resetPass = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 注册账号 -->
    <el-dialog title="注册账号" :visible.sync="userLogin" :close-on-click-modal="no" custom-class="accountManageDialog"
      top="12%" width="35%" @close="resetL('lform')">
      <el-form ref="lform" :model="lform" :rules="ruleLogin">
        <!-- <el-form-item label="账号类型:" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="lform.type">
            <el-radio label="intern">实习</el-radio>
            <el-radio label="outsource">外包</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="账号   :" :label-width="formLabelWidth" prop="userName">
          <!-- <span style="margin-right:5px;">{{lform.type==='intern'?'sx':'wb'}}</span> -->
          <el-input v-model="lform.userName" placeholder="请输入账号" :style="{width:inputLabelWidth}" :maxlength="22">
            <!-- <template slot="prepend">{{lform.type==='intern'?'sx':'wb'}}</template> -->
          </el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
          <el-input v-model="lform.password" type="password" placeholder="请输入密码" :style="{width:inputLabelWidth}"
            :maxlength="30" autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="确认密码:" :label-width="formLabelWidth" prop="checkPassword">
          <el-input v-model="lform.checkPassword" type="password" placeholder="请再次输入密码" :style="{width:inputLabelWidth}"
            :maxlength="30" autocomplete="new-password" />
        </el-form-item>
        <!-- <el-form-item label="公司:" :label-width="formLabelWidth" prop="company" v-if="lform.type==='outsource'">
          <el-input v-model="lform.company" placeholder="请输入公司" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="学校:" :label-width="formLabelWidth" prop="school" v-if="lform.type==='intern'">
          <el-input v-model="lform.school" placeholder="请输入学校" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="手机号码:" :label-width="formLabelWidth" prop="telephoneNumber">
          <el-input v-model="lform.telephoneNumber" placeholder="请输入手机号码" :style="{width:inputLabelWidth}"
            :maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="mail">
          <el-input v-model="lform.mail" placeholder="请输入邮箱,用于密码找回" :style="{width:inputLabelWidth}" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="loginAccount('lform')">确 定</el-button>
        <el-button @click="userLogin = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 公告详情 -->
    <el-dialog :visible.sync="model2" :title="noticeDataList.noticeTitle" top="10%" width="60%"
      custom-class="noticeTitle">
      <!-- <p slot="header">
        <span style="font-size:18px">{{noticeDataList.noticeTitle}}</span>
      </p> -->
      <!-- <h4 class="ps-title">{{noticeDataList.noticeTitle}}</h4> -->
      <p class="ps-notice-content">{{ noticeDataList.noticeContent }}</p>
    </el-dialog>
    <!-- <psloading v-show="loadingState" :text="text"></psloading> -->
  </div>
</template>

<script>
  import {
    httpAjax,
    httpGet
  } from '@/api/common'
  import {
    removeToKen
  } from '@/utils/cookie'
  // import { validUsername } from '@/utils/validate'
  // import psloading from './loading'
  export default {
    data() {
      // const validateUsername = (rule, value, callback) => {
      //   if (!value) {
      //     callback(new Error('请输入用户名'))
      //   } else {
      //     callback()
      //   }
      // }
      // const validatePassword = (rule, value, callback) => {
      //   if (value.length < 6) {
      //     callback(new Error('请输入密码'))
      //   } else {
      //     callback()
      //   }
      // }
      var notNan = (rule, value, callback) => {
        if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
          callback('用户名不能有特殊字符');
        } else if (/(^\_)|(\__)|(\_+$)/.test(value)) {
          callback('用户名首尾不能出现下划线\'_\'');
        } else if (/^\d+\d+\d$/.test(value)) {
          callback('用户名不能全为数字');
        } else if (!/^[\S]{5,22}$/.test(value)) {
          callback('用户名必须6到22位，且不能出现空格');
        } else {
          //接口查重
          httpGet('user/findUser', {
            name: value
          }).then(res => {
            if (res.id) {
              callback('用户名已经被注册');
            } else {
              callback()

            }
          })
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入至少6位'));
        } else {
          //   var regex = new RegExp('/^[\S]{6,12}$/');
          //  var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}');
          var regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[^]{6,30}$')
          if (!regex.test(value)) {
            callback(new Error('密码中必须包含大写字母、小写字母、数字，至少6个字符，最多30个字符'));
          }
          //   if (!/^[\S]{6,12}$/.test(value)) {
          //     callback(new Error('密码必须6到12位，且不能出现空格'));
          //   }
          if (this.lform.checkPassword !== '') {
            this.$refs.lform.validateField('checkPassword');
          }
          callback();
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.lform.password) {
          callback(new Error('两次输入的密码不一致!'));
        } else {
          callback();
        }
      }
      var telP = (rule, value, callback) => {
        var myreg = /^(((1[0-9]{1}))+\d{9})$/;
        if (value == '') {
          callback('请输入手机号码')
        } else if (!myreg.test(value)) {
          callback('请输入有效手机号码');
        } else {
          callback();
        }
      }
      return {
        userLogin: false,
        loginForm: {
          username: '',
          password: '',
        },
        loginType: 'password',
        //   loginRules: {
        //     username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        //     password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        //   },
        //   passwordType: 'password',
        loading: false,
        // showDialog: false,
        // redirect: undefined,
        btnLoading: false,
        loading2: false,
        text: '正在登录中, 请稍后...',
        noticeData: [],
        domainNameList: [],
        // currentActive: 0,
        resetPass: false,
        // userName: '',
        // passWord: '',
        model2: false,
        noticeDataList: '',
        // loadingState: false,
        // single: 'sin',
        // singleTwo: false,
        formLabelWidth: '110px',
        inputLabelWidth: '70%',
        no: false,
        // dform: {
        //   name: '',
        //   mail: ''
        // },
        // ruled: {
        //   name: [{
        //     required: true,
        //     message: '请输入账号名',
        //     // validator: nan16,
        //     trigger: 'blur'
        //   }],
        //   mail: [{
        //     required: true,
        //     message: '请输入邮箱',
        //     // validator: nan32,
        //     trigger: 'blur'
        //   }, {
        //     required: true,
        //     message: '请输入正确的邮箱',
        //     // validator: nan32,
        //     type: 'email',
        //     trigger: 'blur'
        //   }]
        // },
        lform: {
        //   type: 'intern',
        //   company: '',
        //   school: '',
          userName: '',
          password: '',
          checkPassword: '',
        //   telephoneNumber: '',
        //   mail: ''
        },
        ruleLogin: {
          userName: [{
            required: true,
            // message: '请输入用户名',
            validator: notNan,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPassword: [{
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }],
        //   company: [{
        //     required: true,
        //     message: '请输入公司',
        //     // validator: notNan,
        //     trigger: 'blur'
        //   }],
        //   school: [{
        //     required: true,
        //     message: '请输入学校',
        //     // validator: notNan,
        //     trigger: 'blur'
        //   }],
        //   telephoneNumber: [{
        //     required: true,
        //     validator: telP,
        //     trigger: 'blur'
        //   }],
        //   mail: [{
        //     required: true,
        //     message: '请输入邮箱',
        //     // validator: nan32,
        //     trigger: 'blur'
        //   }, {
        //     required: true,
        //     type: 'email',
        //     message: '请输入正确的邮箱',
        //     // validator: nan32,
        //     trigger: ['blur', 'change']
        //   }]
        }
      }
    },
    created() {
      this.clearData()
      //   this.$store.commit('removeTab')
    //   this.getNoticeData()
    //   this.domainName()
    },
    mounted() {
      // this.bannerMove();
    },
    methods: {
      clearData() {
        removeToKen()
        this.$store.commit('removeTab') //移除tab
        this.$store.commit('setType', '') //移除wi过来的type=online
        this.$store.commit('checkWs', '') //移除首页正在连接中的状态
        this.$store.commit('getChat', '') //移除首页点击在线帮助后的状态
        this.$store.commit('changeUse', 1) //移除side menu状态
        this.$store.commit('resetFileAll') //resetFileAll
      },
    //   checkType() {
    //     if (this.loginType === 'password') {
    //       this.loginType = ''
    //     } else {
    //       this.loginType = 'password'
    //     }
    //   },
      resetD() {
        this.dform = {
          name: '',
          mail: ''
        }
        this.$refs.dform.resetFields()
      },
      resetL() {
        this.lform = {
          userName: '',
          password: '',
        //   type: 'intern',
        //   company: '',
        //   school: '',
          checkPassword: '',
        //   telephoneNumber: '',
        //   mail: ''
        }
        this.$refs.lform.resetFields()
      },
      loginAccount(form) {
        this.$refs[form].validate((valid) => {
          let params = {
            ...this.lform
          }
        //   params.userName = params.type === 'intern' ? 'sx' + params.userName : 'wb' + params.userName
          if (valid) {
            this.btnLoading = true
            httpAjax('user/register', params).then(res => {
              if (res.resultCode == "0") {
                this.$message({
                  type: 'success',
                  message: '注册成功!请等待管理员审核'
                })
                this.userLogin = false
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
                })
              }
              this.btnLoading = false
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '请求无法访问!'
              })
              this.resetPass = false
              this.btnLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      forgetPass(form) {
        this.$refs[form].validate((valid) => {
          const params = {
            ...this.dform
          }
          params.tenantDomain = this.domainNameList[0]
          if (valid) {
            this.btnLoading = true
            httpAjax('user/resetPassword', params).then(res => {
              this.resetPass = false
              this.btnLoading = false
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: res.resultDesc //'重置成功!'
                })
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
                })
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '请求无法访问!'
              })
              this.resetPass = false
              this.btnLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // bannerMove() {
      //   var main = this.$refs.bannerWrap
      //   var banner = main.children
      //   var timer = null
      //   var wd = document.documentElement.clientWidth
      //   main.style.width = 3 * wd + 'px'
      //   var num = 0
      //   for (var i = 0; i < banner.length; i++) {
      //     banner[i].style.width = wd + 'px'
      //   }
      //   var cloneNodes = banner[0].cloneNode(true)
      //   main.appendChild(cloneNodes)
      //   var count = 0
      //   var self = this

      //   function moveFn() {
      //     if (count == 3) {
      //       main.style.left = 0 + 'px'
      //       count = 1
      //     }
      //     $(main).stop(true).animate({
      //       'left': -count * wd + 'px'
      //     }, 4000)
      //   }
      //   timer = setInterval(function() {
      //     count++
      //     moveFn()
      //   }, 10000)
      // },
    //   domainName() {
    //     const url = 'user/findDomainName'
    //     httpAjax(url).then((res) => {
    //       if (res.length) {
    //         this.domainNameList = res
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   },
    //   getNoticeData() {
    //     httpAjax(`notice/list`).then((res) => {
    //       this.noticeData = res.data.slice(0, 7)
    //     }).catch((err) => {
    //       this.$notify.error({
    //         title: '公告模块',
    //         message: '网络出错,请刷新页面后再访问！'
    //       })
    //     })
    //   },
      // switchLoginState(index) {
      //   this.currentActive = index
      //   if (index == 0) {
      //     this.single = 'sin'
      //   } else {
      //     this.single = 'two'
      //   }
      //   this.userName = ''
      //   this.passWord = ''
      // },
      submitLogin() {
        //  console.log(this.loginForm.username,this.loginForm.password)
        if (!this.loginForm.username || !this.loginForm.password) {
          this.$message.warning('用户名密码不能为空')
          return;
        }
        // if (!this.domainNameList.length && this.loginForm.username !== 'admin') {
        //   this.$message.info('正在连接FA，请稍等!')
        //   return
        // }
        // var path = "login"
        // if (this.currentActive) {
        //   params.operatorAccount = this.userName
        //   params.password = this.passWord
        // } else {
        //   path = "domainLogin"
        let params = {
          name: this.loginForm.username,
          initialPassword: this.loginForm.password,
        //   tenantDomain: this.domainNameList[0]
        }
        // params.name = this.loginForm.username
        // params.initialPassword = this.loginForm.password
        // params.tenantDomain = this.domainNameList[0]
        // }
        // params.domainId = this.domainNameList[0]
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
          if (res.resultCode == 0) {
            this.$store.commit('SET_TOKEN', res.role || 'user')
            sessionStorage.setItem('username', this.loginForm.username);
            sessionStorage.setItem('avatar', res.avatar)
            sessionStorage.setItem('userId', res.id);
            sessionStorage.setItem('password', this.loginForm.password);
            sessionStorage.setItem('domain', this.domainNameList[0]);
            if(res.role==='tenant'){
                this.$router.push({
                  path: '/studentManagement'
                })

            }else if(res.role==='admin'){
                this.$router.push({
                  path: '/classroomManagement'
                })

            }else{
                 this.$router.push({
                  path: '/desktopApply'
                })
            }

          } else {
            this.$message.error(res.resultDesc)
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
    }
    // components: {
    //   psloading
    // }
  }

</script>
<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  //   $bg:#013964;
  //   $light_gray:#cec6c6;
  //   $cursor: #fff;

  // @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  //   #login .el-input input{
  //     color: $cursor;
  //     // &::first-line {
  //     //   color: $light_gray;
  //     // }
  //   }
  // }

  /* reset element-ui css */
  //   #login {
  //     .login-form .el-input {
  //       display: inline-block;
  //       height: 47px;
  //       width: 85%;

  //       input {
  //         background: transparent;
  //         border: 0px;
  //         -webkit-appearance: none;
  //         border-radius: 0px;
  //         padding: 12px 5px 12px 15px;
  //         color: #fff;
  //         height: 47px;
  //         caret-color: #fff;

  //         &:-webkit-autofill {
  //           box-shadow: 0 0 0px 1000px #013964 inset !important;
  //           -webkit-text-fill-color: #fff !important;
  //         }
  //       }
  //     }
  //   }
  #login .el-dialog__header {
    text-align: center;
  }

 
#login input:-webkit-autofill{
//    background-color: #575962 !important;
//     background-image: none !important;
    // color: rgb(0, 0, 0) !important;
      -webkit-text-fill-color: #575962 !important;
    //   transition:none;
//         box-shadow: 0 0 0px 1000px #013964 inset !important;
  } 


  .login-wrap .el-input__inner {
    border: none;
    border-bottom: 1px solid #ebedf2;
    color: #575962;
    border-radius: 0;
  }

</style>
<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
  }

  .left-wrap {
    background-color: #fff;
    flex: 0 0 35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .left-login {
    /* width: 50%; */
    height: 550px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .right-wrap {
    height: 100%;
    background: url('../../assets/img/backg.jpg') no-repeat 40% 100%/cover;
    flex: 1;

  }

  .ms-title {
    margin: 10px 0 30px;
    color: #565f69;
    font-size: 22px;
  }

  .ps-form-item {
    margin-top: 10px;
    text-align: right;
    font-size: 15px;
    font-weight: 600;
    text-decoration: underline;
    color: #565f69;
    cursor: pointer;
    width: 100%;
    /* padding-top: 25px; */
  }
  .login-btn {
    text-align: center;
    margin-top: 40px;
  }

  .login-btn button {
    width: 130px;
    border-radius: 60px;
    /* height: 36px; */
  }

  /* form {
        margin-top: 20px;
    } */

  #login {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    /* background: url('../../assets/img/shanghai.jpg') no-repeat 50% 60%/cover; */
    /* background: url('../../assets/img/shanghai2.jpg') no-repeat 50% 10%/cover; */
    /* background: url('../../assets/img/shanghai5.jpg') no-repeat 50% 0%/cover; */
    /* background: url('../../assets/img/shanghai6.jpg') no-repeat 50% 0%/cover; */
    ;
  }

  /* .banner {
    height: 100%;
  } */
  /* .login-form .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

  } */
  /* .notice-title {
    text-align: center;
    margin-top: 35px;
    margin-bottom: 25px;
  } */

  /* .login-open .list {
    font: 14px '微软雅黑';
  } */

  /* .login-open .list li {
    width: 320px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
    padding-left: 20px;
    white-space: nowrap;
    cursor: pointer;
    font-size: 16px;
  } */

  /* .svg-container {
    padding: 6px 0 6px 15px;
  } */

  /* .login-open .list li a {
    padding-left: 5px;
  } */

  /* .flexcenter {
    display: flex;
    align-items: center;
  } */

  /* .login-open {
    display: flex;
    width: 700px;
    height: 400px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: #fff;
  } */

  /* .login-welcome-left {
    flex: 1;
    display: flex;
    font-size: 24px;
  } */

  /* .cornerClass {
    position: relative;
    height: 44px;
    width: 100%;
    margin: 0 auto 20px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  } */

  /* .whitec {
    position: relative;
    width: 30px;
    cursor: pointer;
  } */

  /* .cornerClass::before {
    display: block;
    content: '';
    border-width: 30px 30px 30px 30px;
    transform: rotate(45deg);
    border-style: solid;
    border-color: #003b67 transparent transparent transparent;
    position: absolute;
    left: 203px;
    top: 8px;
    z-index: 1;

  } */

  /* .login-tip {
    position: absolute;
    top: 8px;
    right: 40px;
    display: block;
  } */

  /* .poptip {
    line-height: 16px;
    position: relative;
    z-index: 1;
    border: 1px solid #00c1de;
    padding: 5px 10px;
    border-right: transparent;
  } */

  /* .poptip-arrow{
  position: absolute;
    z-index: 10;
    top: 8px;
    right: -10px;
     border-width:10px 10px 10px 10px;
    transform: rotate(-90deg);
    border-style:solid;
    border-color:#00c1de transparent transparent transparent;
} */
  /* .poptip-content {
    color: #00c1de;
    font-size: 12px;
    font-weight: 400;
    position: relative;
  } */

  /* .poptip:before { */
    /* content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 6px;
    background: #00c1de; */
    /* border-right: 9px solid #00c1de;
    border-bottom: 9px solid transparent;
    border-top: 9px solid transparent;
    transform: rotate(180deg); */
  /* } */

  /*  上下透明，右边框为9px且在:before伪元素三角形的基础上，向右，下移动了1px  */
  /* .poptip:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 1px;
    height: 4px;
    background: #00c1de; */
    /* border-bottom: 7px solid transparent;
    border-right: 7px solid rgb(0, 0, 0);
    border-top: 7px solid transparent;
    transform: rotate(180deg); */
  /* } */

  /* .login-form {
    flex: 1;
  } */

  /* .loagin-notice {
    width: 100%;
  } */

  /* .no-notice {
    align-items: center;
    justify-content: center;
  } */
/* 
  .form-container {
    width: 280px;
    margin: 32px auto 0;
  } */

  /* .form-container .list li {
    width: 50%;
    padding: 5px 0px;
    text-align: center;
    color: #fff;
    border-bottom: 2px solid #fff;
  } */

  /* .form-container a {
    color: #fff;
    display: block;
    width: 100%;
  } */

  /* .login-form input {
    border-style: none;
    color: #fff;
    background: rgba(0, 0, 0, 0);
  } */


  /* .border-bottom {
    border-bottom: 1px solid #fff;
  } */

  /* .login-this-active {
    border-bottom: 2px solid #2b85e4 !important;
  }

  .el-radio {
    color: #fff;
  } */

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
    font-size: 15px;
  }

  /* .loagin-notice .icon-announcement {
    font-size: 20px;
    display: inline-block;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    vertical-align: -3px;
  } */

  /* .loagin-notice a,
  .ps-title,
  .ps-notice-content {
    font-size: 15px;
  } */

  /* .login-form .ivu-btn {
    padding: 8px 15px;
  } */

  /* .loagin-notice a:hover {
    text-decoration: underline;
  } */



  /* 
  .noticeTitle .el-dialog__title {
    font-weight: 600
  } */

</style>
