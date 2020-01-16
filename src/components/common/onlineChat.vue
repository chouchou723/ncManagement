<template>
  <div id="onlineChat">
    </div>
  </div>
</template>

<script>
  import {
    httpAjax
  } from 'api/common'
  var websocket;
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入至少6位'));
        } else {
          //   var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}');
          //   if (!regex.test(value)) {
          //     callback(new Error('密码中必须包含字母、数字，至少6个字符，最多30个字符'));
          //   }
          //   if (this.ruleForm2.checkPass !== '') {
          //     this.$refs.ruleForm2.validateField('checkPass');
          //   }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.params.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        btnLoading: false,
        params: {
          initialPassword: '',
          newPwd: '',
          newPwdConfirm: ''
        },
        inputLabelWidth: '300px',
        formLabelWidth: '110px',

      }
    },
    mounted() {
        this.connectWebSocket()
    },
created(){
},
    methods: {
      initIm() {
        layui.use('layim', function (layim) {
          layim.config({
            uploadImage: {
              url: ''
            },
            init: {
              mine: { //配置发送者的信息
                "username": sessionStorage.getItem('username'),
                "id": sessionStorage.getItem('userId'),
                "status": "online"
                  //,"remark": "我是普通用户" 
                  ,
                "avatar": require('../../assets/img/me.png')
              }
            }
            //msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html',//需要自己定义页面
            // chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html',//自己定义页面
            //开启客服模式
            ,
            isfriend: false //是否开启好友
              ,
            isgroup: false //是否开启群组
              ,
            title: '在线帮助' //自定义主面板最小化时的标题
              ,
            min: true
            //   ,brief: true
              ,
            initSkin: '1.jpg' //1-5 设置初始背景
              ,
            notice: true //是否开启桌面消息提醒，默认false
          });
          layim.on('sendMessage', function (res) {
              //通过websocket发给后台MsgScoketHandle.handleMessage这个接口
            websocket.send(JSON.stringify(res));
          });
          $('.layim-tool-about').hide();
        });
          this.chatWith();
      },
      connectWebSocket() {
        let params = {};
        params.userName = sessionStorage.getItem('username');
        httpAjax('websocket/login',params).then(res=>{
            if (!websocket) {
              if ('WebSocket' in window) {
                websocket = new WebSocket("ws://" + window.location.host + "/api/webSocketServer");
              } else if ('MozWebSocket' in window) {
                websocket = new MozWebSocket("ws://" + window.location.host + "/api/webSocketServer");
              }
              this.initIm();
              websocket.onmessage = function (res) {
                /*  if(typeof res.data=== String){
	    		   console.log("Received data string")
	    	   }
	    	   if(res.data instanceof ArrayBuffer){
	    		    var buffer = res.data;
	    		    console.log("Received arraybuffer");
	    		  } */
                layui.use('layim', function (layim) {
                  layim.getMessage(JSON.parse(res.data))
                });
              };
              websocket.onclose = function (e) {
                console.log(e)
                //connectWebSocket();
              };
            }
        })
        // $.ajax({
        //   url: "dcp/websocket/login",
        //   type: "POST",
        //   dataType: "json",
        //   data: params,
        //   success: function (data) {
        //     if (!websocket) {
        //       if ('WebSocket' in window) {
        //         websocket = new WebSocket("ws://" + window.location.host + "/api/webSocketServer");
        //       } else if ('MozWebSocket' in window) {
        //         websocket = new MozWebSocket("ws://" + window.location.host + "/api/webSocketServer");
        //       }
        //       that.initIm();
        //       websocket.onmessage = function (res) {
        //         /*  if(typeof res.data=== String){
	    // 		   console.log("Received data string")
	    // 	   }
	    // 	   if(res.data instanceof ArrayBuffer){
	    // 		    var buffer = res.data;
	    // 		    console.log("Received arraybuffer");
	    // 		  } */
        //         layui.use('layim', function (layim) {
        //           layim.getMessage(JSON.parse(res.data))
        //         });
        //       };
        //       websocket.onclose = function (e) {
        //         console.log(e)
        //         //connectWebSocket();
        //       };
        //     }
        //   },
        //   error: function () {
        //     layer.alert('通讯出错!', {
        //       icon: 5
        //     });
        //   }
        // });
      },
      chatWith(id, liItem) {
          httpAjax('user/findOther').then(res=>{
              console.log(res)
              let support = res[0]
              layui.use('layim', function (layim) {
                layim.chat({ //配置to的信息,即接收者的信息
                  name: support.name,
                  type: 'friend',
                  avatar: require('../../assets/img/ava.gif'),
                  id: support.id,
                //   status: liItem.find('span').attr('data-state')
                })
              });
          })
      },
    }
  }

</script>
<style>
/* .layui-layim-tab, .layim-status-online, .layui-layim-tool,body .layui-layim-remark{
    display: none;
} */
/* .layui-layim-tool .layim-tool-search{
    display: none;
} */
</style>

