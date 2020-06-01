<template>
  <div class="hello" :style="{background:background}">
    <img src="../../assets/img/huawei.png" alt="" class="logo">
    <img src="../../assets/img/logout.png" alt="" class="logout" @click="gotoB">

    <div class="promptText" :style="{fontSize:promptFontSize+'px'}">{{prompt}}</div>
    <div class="tip" v-if="type!==''">点击上方桌面按钮进入</div>
    <img src="../../assets/img/uu.png" alt="" class="tipImg tip1" v-if="type!==''">
    <img src="../../assets/img/uu.png" alt="" class="tipImg tip2" v-if="type!==''">
    <div class="wrap" v-if="type!==''">
      <div class="item firstItem" :style="type==='all'?'margin-right:5%':''" v-if="type!=='personal'" @click="goto('teach')">
        <img src="../../assets/img/edu.png" alt="" class="itemImg firstImg">
        <div class="itemFont">
          <div class="bigFont">{{teacherTextCn}}</div>
          <div class="smallFont">{{teacherTextEn}}</div>
        </div>
      </div>
      <div class="item secondItem" v-if="type!=='teaching'" @click="goto('personal')">
        <img src="../../assets/img/ind1.png" alt="" class="itemImg secImg">
        <div class="itemFont">
          <div class="bigFont">{{personTextCn}}</div>
          <div class="smallFont">{{personTextEn}}</div>
        </div>
      </div>
    </div>
    <!-- <div class="loginUser">
        <div>用户注册</div>
    </div> -->
  </div>
</template>

<script>
  import {
    httpAjax,
    httpGet,
  } from 'api/common'
  export default {
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        type: '',
        background: '#296683',
        prompt: '',
        loginUrl:'',
        uid:'',
        pid:'',
        promptFontSize: 12,
          teacherTextCn: '教学桌面',
          teacherTextEn: 'Teaching Desktop',
          personTextCn: '个人桌面',
          personTextEn: 'Personal Desktop'
      }
    },
    methods: {
        gotoB(){
            this.$router.push('/login')
        },
      goto(type) {
        if (type === 'personal') {
          window.location.href = this.loginUrl
        } else {
          //获取教学桌面接口
            function compileStr(code) {
              var c = String.fromCharCode(code.charCodeAt(0) + code.length);
              for (var i = 1; i < code.length; i++) {
                c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
              }
              return escape(c);
            }
            let uid = compileStr(this.uid);
            let pid = compileStr(this.pid);
            setTimeout(() => {
              window.location.href = this.loginUrl + '?uid=' + uid + '&pid=' + pid; //修改配置
            }, 500);

        }
      },
      getVmList(first, page) {
        const url = `classroom/findIpSetting`
        httpGet(url).then((res) => {
          console.log(res)
          let lt = res.loginType.split(',');
          lt.length === 2 ? this.type = 'all' : this.type = lt[0];
          this.background = res.background;
          this.prompt = res.prompt;
          this.loginUrl = res.wiLink
          this.uid = res.teachingName;
          this.pid = res.teachingPwd;
           this.promptFontSize = res.promptFontSize||12;
        this.teacherTextCn = res.teacherTextCn||'教学桌面';
        this.teacherTextEn = res.teacherTextEn||'Teaching Desktop';
        this.personTextCn = res.personTextCn||'个人桌面';
        this.personTextEn = res.personTextEn||'Personal Desktop';
          //   this.getStatistics()
        }).catch((error) => {
          console.log(error)
        })
      },
      homedo(){
          //html修改 /pages/homepage.do
     // <div id="promptText" style="position: absolute;top: 36px;left:0;right:0;margin:0 auto;color:white;font-size:30px;text-align: center;display: none;"></div>

            //wip 修改/webui/default/js/src/dashboard.js 找到 webui.objects.dashbord.hdpclient.begin();
             var host = 'http://172.16.1.156:6060'//需要根据实际WIP的host进行配置
        $.ajax({//
          url: host + '/api/classroom/findIpSetting',
          type: 'GET',
          cache: false,
          dataType: "json",
          data: '',
          success: function (msg) {
            $('html').css('background', res.background);
            if (res.prompt) {
              $('#promptText').text(res.prompt);
              $('#promptText').show();
            }
            // webuilog(loglevel.info, "Get " + url + " success,response body is: ");
            // webuilog(loglevel.info, msg);
            // ServiceAPI.successHandler(msg, success_callback, '');
          },
          error: function (response) {
            // webuilog(loglevel.info, "Get " + url + " error,status is: " + response.status);
            // ServiceAPI.errorHandler(response, error_callback, '');
          }
        });
      },
      login() {//WI的login页面修改
      //html修改/pages/login.do
  //    <div id="promptText" style="position: absolute;top: 36px;left:0;right:0;margin:0 auto;color:white;font-size:30px;text-align: center;display: none;"></div>

        //wip 修改/webui/default/js/src/explicit.js 找到clientMac = hdpclient.getClientMac();
        var host = 'http://172.16.1.156:6060'//需要根据实际WIP的host进行配置
        $.ajax({//
          url: host + '/api/classroom/findIpSetting',
          type: 'GET',
          cache: false,
          dataType: "json",
          data: '',
          success: function (msg) {
            $('html').css('background', res.background);
            if (res.prompt) {
              $('#promptText').text(res.prompt);
              $('#promptText').show();
            }
            // webuilog(loglevel.info, "Get " + url + " success,response body is: ");
            // webuilog(loglevel.info, msg);
            // ServiceAPI.successHandler(msg, success_callback, '');
          },
          error: function (response) {
            // webuilog(loglevel.info, "Get " + url + " error,status is: " + response.status);
            // ServiceAPI.errorHandler(response, error_callback, '');
          }
        });



        function getQueryVariable(variable) {
          var query = window.location.search.substring(1);
          var vars = query.split("&");
          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
              return pair[1];
            }
          }
          return (false);
        }

        function uncompileStr(code) {
          code = unescape(code);
          var c = String.fromCharCode(code.charCodeAt(0) - code.length);
          for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
          }
          return c;
        }
        var logout = getQueryVariable('isLogout');
        if (logout) {
          $('#addiv').hide()
          $('#userloginpanel').hide()
          $('#loadingpanel').show()
          window.location.href = "http://172.32.3.51:7070" //wip地址或者uns登录地址
        }
        var uid = getQueryVariable('uid');
        var pid = getQueryVariable('pid');
        if (uid && pid) {
          //得到mac地址
          $('#addiv').hide()
          $('#userloginpanel').hide()
          $('#loadingpanel').show()
          if (accessType != "android_tc") {
            if (clientMac == null || clientMac == "") {
              mac = hdpclient.getClientMac();
            } else {
              mac = clientMac;
            }
          }

          //获取页面mac地址
          if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system
            .config.runningMode) {
            if (null == mac || '' == mac || "undefined" == typeof (mac)) {
              errorLabel.text(Login.getString("macNotNull"));
              showErrorLabel(1);
              $("#loginBtn").bind("click", doLogin);
              $("#loadingpanel").css({
                "z-index": "0"
              }).hide(); //显示缓冲图片
              return false;
            } else {
              mac = mac.replace(/-/g, "");
            }
          }
          var contextName = [];
          var obj = {
            username: uncompileStr(uid),
            password: uncompileStr(pid),
            macAddress: mac,
            deviceType: accessType
          };
          var params = JSON.stringify(obj);
          var success_callback = function (msg) {
            $("#loginBtn").bind("click", doLogin);

            //如果用户登录成功，且输入用户名、密码错误次数小于3时，页面进行跳转，否则显示验证码输入框进行验证
            $("#loadingpanel").css({
              "z-index": "0"
            }).hide();

            //如果认证成功调用android_tc方法
            webui.explicit.unicom.remberLogin();

            var loginRsp = msg;
            if (loginRsp.resultCode == ResultCode.code.OPERATE_SUCCESS || loginRsp.resultCode ==
              ResultCode.code.SUCCESS) {
              clientTicket = loginRsp.loginState;
              commonvar.setCookieByProtocol("userName", uname);
              jump2home();
            } else {
              $("#userPass").val("");
              commonvar.setCookieByProtocol("userName", uname);
              checkCode(loginRsp.resultCode);
            }
          };
          var error_callback = function (msg, error) {
            $("#loadingpanel").css({
              "z-index": "0"
            }).hide();
            $("#loginBtn").bind("click", doLogin);
            $("#userPass").val("");
            errorLabel.hide();
            if (error == "timeout") {
              showErrorLabel(0, error);
            } else {
              showErrorLabel(0, msg.status);
            }

          };
          ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.userLogin, success_callback,
            error_callback); //ServiceAPI.serviceUrl.
        }
      },
    },
    created() {
      this.getVmList();
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    /* display: flex;
    justify-content: center;
    align-items: center; */
    height: 100%;
    width: 100%;
    /* background: #296683; */

  }

  .wrap {
    /* display: flex;
    justify-content: center; */
    width: 900px;
    height: 200px;
    /* border: 1px solid gainsboro; */
    padding: 20px 0;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .promptText {
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    margin: 0 auto;
    color: white;
    font-size: 30px;
    text-align: center;
    ;
  }

  .secondItem {
    /* display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 45%; */
    width: 47%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #74bfaf;
    box-sizing: border-box;
    padding: 0 60px;
    border-radius: 20px;
    cursor: pointer;
    transition: all linear .3s;
    box-shadow: 0px 0px 10px grey;

  }

  .firstItem {
    background: #da378d;
    /* display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 45%; */
    width: 47%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 60px;
    border-radius: 20px;
    cursor: pointer;
    transition: all linear .3s;
    box-shadow: 0px 0px 10px grey;

  }

  .item:hover {
    box-shadow: 2px 5px 15px grey;
  }

  .itemImg {
    height: 100px;
    width: 100px;
  }

  .firstImg {
    border-radius: 10px;
    box-shadow: 0px 0px 5px white;
    transition: all linear .2s;
    /* margin-top: 30px; */
    margin-right: 30px;

  }

  .secImg {
    border-radius: 10px;
    box-shadow: 0px 0px 5px white;
    /* margin-top: 30px; */
    margin-right: 30px;

  }

  .item:hover .firstImg,
  .item:hover .secImg {
    box-shadow: 0px 0px 10px white;

  }

  .itemFont {
    color: white;
    /* float: right; */
    /* margin-top: 35px; */
    /* display: inline-block; */
  }

  .bigFont {
    font-size: 30px;
    margin-bottom: 20px;
    transition: all linear .2s;
  }

  .smallFont {
    font-size: 20px;
    transition: all linear .2s;
  }

  .item:hover .bigFont,
  .item:hover .smallFont {
    text-shadow: 0px 0px 2px white;

  }

  .logo {
    position: absolute;
    top: 36px;
    left: 2%;
  }
.logout{
     position: absolute;
    top: 36px;
    right: 2%;
    cursor: pointer;
    z-index: 1;
}
/* .loginUser{
    position: absolute;
    top:36px;
    right: 4%;
    color: white;
    font-size: 20px;
} */
  .tip {
    position: absolute;
    left: 0;
    right: 0;
    top: 75%;
    margin: 0 auto;
    font-size: 22px;
    color: white;
    text-align: center;

  }

  .tipImg {
    position: absolute;
    left: 0;
    right: 0;
    top: 63%;
    margin: 0 auto;
    font-size: 24px;
    color: white;
    width: 60px;
  }

  .tip1 {
    animation: ss infinite 1.5s ease-in-out;
  }

  .tip2 {
    top: 65.6%;
    animation: ss infinite 1.5s ease-in-out;

    /* animation-delay: .2s; */
  }

  @keyframes ss {
    0% {
      transform: scale(1)
    }

    50% {
      transform: scale(1.1)
    }

    100% {
      transform: scale(1)
    }
  }
/* @media screen and (max-width: 1280px) {
    .wrap {
      width: 70%;
    }


  } */
</style>
