<template>
  <div id="header" v-loading.fullscreen="vloading" element-loading-text="正在为您连接在线帮助">
    <div class="logo fl">
      <!-- <img _src="static/img/logoIcon.png"><span class="name">桌面云管理门户</span> -->
      <!-- <i class="iconfont icon-shousuo fzicon"
        :style="$store.state.canUse?'transform: rotate(180deg);':'transform: rotate(0);'" @click="changeUse"></i> -->
      <!-- <img src="../assets/img/cloud.png" width="30" class="rotateI"><span class="name">桌面云管理</span> -->
      <!-- <breadcrumb class="breadcrumb-container" /> -->
      <!-- <tags-view class="tagView" /> -->
    </div>
    <ul class="header-list fr">
      <div style="margin-right:10px;color:#606266;">
        Hi,{{new Date().getHours()>=12?'下午':'上午'}}好:
      </div>
      <!-- <li class="li-header-item"><span>Hi,{{new Date().getHours()>=12?'下午':'上午'}}好:</span></li> -->
      <!-- <li class="li-header-item">
        <i class="iconfont icon-admin"></i><span class="user-name">{{username}}</span>
      </li> -->
      <el-dropdown @command="handleCommand" @visible-change="statusChange" placement='top'>
        <span class="el-dropdown-link">
          <!-- <i class="iconfont icon-admin"></i> -->
          <div style="display:flex;align-items:center;height: 100%;margin-right:15px;">
            <img src="~assets/img/avatar.png" alt="" width="30" height="30" class="userAvatar">
            <span class="user-name">{{username||'chouchou723'}}
              <span
                style="color:#489e77;font-size:16px;">[{{localRole==='admin'?'系统管理员':localRole==='tenant'?'云管理员':localRole==='user'?'普通用户':localRole==='troubleshooting'?'故障报修组':localRole==='support'?'在线支持组':'资产管理员'}}]</span>

            </span>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-edit" command="edit">修改密码</el-dropdown-item>
          <!-- <el-dropdown-item icon="el-icon-question" :disabled="true" v-show="wsStatus==''">连接中</el-dropdown-item> -->
          <!-- <el-dropdown-item :icon="!wsStatus?'el-icon-loading':'iconfont icon-bangzhuzhongxin'" command="online"
            :disabled="!wsStatus" v-if="localRole==='user'">{{!wsStatus?'&nbsp;连接中...':'&nbsp;在线帮助'}}
          </el-dropdown-item> -->
          <!-- <el-dropdown-item icon="iconfont  icon-mimaguanli-copy" command="edit">我的秘钥</el-dropdown-item> -->
          <el-dropdown-item icon="iconfont icon-tuichu" command="quit">&nbsp;退出&nbsp;</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <div class="skin-main">
        <i class="iconfont icon-pifugexinghua"
          :style="type==5?'color:#296683;cursor:pointer;font-size:20px;':'color:#606266;cursor:pointer;font-size:20px;'"></i>
        <div class="skin-main-btn">
          <span @click="skinPeelerChange(5)"><i class="skin-huawei"></i><span
              :style="{borderBottom:type===5?'2px solid #448bad':'',color:'#448bad'}">BlueGreen</span></span>
          <span @click="skinPeelerChange(6)"><i class="skin-my"></i><span
              :style="{borderBottom:type===6?'2px solid #304156':'',color:'#304156'}">DarkBlue </span></span>
        </div>
      </div> -->
      <div class="skin-main">
        <!-- <i class="iconfont icon-bangzhuzhongxin" style="color:#296683;cursor:pointer;font-size:20px;" @click="getOnline"
          v-if="localRole==='user'"></i> -->
          <img src="../../assets/img/chat1.png"  v-if="localRole==='user'&&wsStatus" alt="" title="在线帮助" @click="getOnline" style="width:35px;height:35px;cursor:pointer">
          <img src="../../assets/img/chat2.png"  v-if="localRole==='user'&&(!wsStatus)" alt="" title="在线帮助" style="width:35px;height:35px;cursor:pointer">
      </div>
      <!-- <li class="li-header-item skin-main">
        <a ><i class="iconfont icon-mianxingtubiaohuanfu47"></i></a>
      </li> -->
      <!-- <li class="header-quit">
        <a @click="quit" style="padding: 0 6px;">
          <i class="iconfont icon-quit" style="font-size:16px !important;margin-right:5px"></i>退出</a>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import {
    removeToKen
  } from 'utils/cookie'
  import Breadcrumb from './Breadcrumb/'
  import TagsView from './TagsView/'
  import {
    httpAjax
  } from 'api/common'
  import fileupload from './uploader/fileUpload.js'
  import SparkMD5 from './uploader/md5.js'
  import './uploader/sha256.js'
  var websocket;
  export default {
    name: 'headers',
    data() {
      return {
        // timestamp: '',
        username: '',
        // show: false,
        type: 5,
        layim: '',
        // uuid: '',
        avatar: '',
        wsStatus: '',
        // websocket: '',
        localRole: '',
        vloading: false,
        fileLoader: {},
        isCompleted: 'first',
      }
    },
    components: {
      Breadcrumb,
      TagsView
    },
    watch: {
      '$store.state.chatStatus'(n, o) { //接收首页状态
        // console.log(n,o)
        if (n === 'start') {
          this.chatWith();
        }
      },
      '$store.state.fileList'(newF, oldF) { //接收首页状态
        // console.log(newF, oldF);
        let item = newF.map(item => item.raw)
        // let that = this;
        // newF.map((item,index)=>{
        if (item.length > 0 && this.$store.state.isClick) { //只有当点击了上传按钮后才触发
        //   console.log(item)
          this.initUpload(item)
          this.$store.commit('changeIsClick', false);
        }
        // })
      },
      '$store.state.uploadStatus'(newF, oldF) { //接收指定文件的恢复,取消,报错,暂停状态
        // console.log(newF)
        if (newF.type === "pause") {
          this.fileLoader.setPause(true);
        } else if (newF.type === 'goon') {
          this.fileLoader.setGoonFile(newF.name)
          this.isCompleted = 'notFirst';
        } else if (newF.type === 'cancel') { //取消
          this.fileLoader.deleteFile(newF.name); //触发取消上传
          this.$store.commit('delFile', newF.name) //删除当前文件在filelist中
        } else if (newF.type === 'fail') { //上传的文件报错状态
          //   this.fileLoader.failGoon(); //继续下一个
          //   this.$store.commit('delFile', newF.name) //删除当前文件在filelist中
        }
      },
    },
    computed: {
      // wsStatus(){
      //     return sessionStorage.getItem('wsStatus')||''
      // }
      wsUrl() {
        if (window.location.host === 'localhost:9000') {
          return `ws://172.16.6.18:9090/dcp/webSocketServer?userName=${this.username}`;
        } else {
          return `ws://${window.location.host}/dcp/webSocketServer?userName=${this.username}`;
        }
      }
    },
    mounted() {
      this.username = sessionStorage.getItem('username')
      this.avatar = sessionStorage.getItem('avatar')
      this.connectWebSocket()
    //   this.skinPeelerChange();

    },
    created() {
      //   console.log(sha256, 23940294)
      this.localRole = sessionStorage.getItem('role')
      sessionStorage.setItem('wsStatus', '')
      if (this.$store.state.type === 'online') {
        this.vloading = true;
      }
      if (this.localRole !== 'admin') {
        var params = {
          user: sessionStorage.getItem('username'),
        }
        let url = `bigFile/refreshQuota`
        httpAjax(url, params).then((res) => {
          this.$store.commit('setNowStatus', {
            usedRate: res.rate,
            leftQuota: res.left,
            usedQuota: res.used,
            leftRaw:res.leftRaw
          })
        }).catch((err) => {
          console.log(err)
        })
      }
      //  var d = new Date().getTime();
      // this.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      //     var r = (d + Math.random() * 16) % 16 | 0;
      //     d = Math.floor(d / 16);
      //     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      // });
    },

    methods: {
      getOnline() {
        if (this.wsStatus) {
          this.chatWith();
        } else {
          this.$message.info('通讯服务连接中')
        }
      },
      initUpload(item) {
        if (this.isCompleted === 'first') { //第一次点击的时候初始化
          let that = this;
          this.fileLoader = new fileupload({
            upload: '/dcp/bigFile/uploadSlice',
            query: '/dcp/bigFile/querySlice',
            merge: '/dcp/bigFile/findBigFile',
            cache: false,
            thread: 1, // 线程数
            filesign: sha256 //SparkMD5.ArrayBuffer.hash//
          });
          this.fileLoader.on({
            success: function () { //全部文件上传全部完成
              console.log('全部上传完成');
              //   that.isCompleted = 'complete'
              setTimeout(() => {
                that.$message.success(`全部上传任务完成!`)
                that.$store.commit('setNowStatus', {
                    allDone:'done'
                  })
              }, 2000)
            },
            complete: function (filename) { //当前文件上传全部完成
              console.log(filename + '上传完成');
              //删除state中完成的
              //$message提示
              that.$store.commit('setUploadStatus', { //成功的状态
                name: filename,
                type: 'transfer'
              })
            },
            error: function (name) { //upload失败时
              console.log('上传报错');
              //   that.isCompleted = 'complete';
              //   setTimeout(() => {
              that.$store.commit('setUploadStatus', {
                name: name,
                type: 'fail'
              })
              //   }, 2000)
              // console.log(that.$route)
              if (that.$route.path !== '/fileManagement') {
                that.$notify({
                  title: name + '上传失败',
                  message: '请刷新尝试重新上传',
                  type: 'error'
                });

              }
            },
            pause: function () { //全部停止
              console.log('上传全部停止');
              that.isCompleted = 'complete';
            },
            query: function (data) {
              //console.log(data);
            },
            merge: function (filename) { //合并完成
              //console.log(data);
              //   that.$store.commit('setUploadStatus', { //成功的状态
              //     name: filename,
              //     type: 'mergeSuccess'
              //   })
              if (that.$route.path !== '/fileManagement') {
                that.$notify({
                    title: '上传完成',
                  message: '文件:' + filename + '上传成功',
                  type: 'success'
                });

              } else {
                that.$message.success(`文件:${filename}上传成功!`)
              }
              setTimeout(() => {
                that.$store.commit('setUploadStatus', {
                  type: 'cancel',
                  name: filename
                })

                var params = {
                  user: sessionStorage.getItem('username'),
                }
                let url = `bigFile/refreshQuota `
                httpAjax(url, params).then((res) => {
                  that.$store.commit('setNowStatus', {
                    usedRate: res.rate,
                    leftQuota: res.left,
                    usedQuota: res.used,
                    leftRaw:res.leftRaw

                  })
                }).catch((err) => {
                  console.log(err)
                })
              }, 1000)
            },
            upload: function (data) {
            //   console.log(data);
            },
            progress: function (progress) {
              let {
                progressN,
                filename,
                sliceNum
              } = progress;
            //   console.log(progressN, sliceNum,3399)
              //   that.$store.commit('setUploadStatus', {
              //     type: 'downloading',
              //     name: filename
              //   })
              that.$store.commit('changeStatue', {
                name: filename,
                progress: progressN,
                sliceNum
              })
              //   progress = 100 * progress;
              //需要更新store的progress
              // document.getElementById("progess").value = progress.toFixed(2);
            }
          });
          // console.log(this.fileLoader )
        }
        this.fileLoader.addFile(item);
        if (this.isCompleted === 'complete' || this.isCompleted === 'first') { //第一次时需要调用线程
          this.fileLoader.upload('first');
          this.isCompleted = 'notFirst'
        } else {
          this.fileLoader.upload('notFirst');
        }
      },
      statusChange() {
        this.wsStatus = sessionStorage.getItem('wsStatus')
      },
      initIm(type, w) {
        let that = this;
        layui.use('layim', (layim) => {
          //   if (!type) {
          layim.config({
            uploadImage: {
              url: '/dcp/uploader/layimUpload?type=chat'
            },
            init: {
              mine: { //配置发送者的信息
                "username": sessionStorage.getItem('username'),
                "id": sessionStorage.getItem('userId'),
                "status": "online"
                  //,"remark": "我是普通用户" 
                  ,
                "avatar": sessionStorage.getItem('avatar')
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
            //   right:'1166px',
            min: true
              // ,brief: true
              ,
            initSkin: '1.jpg' //1-5 设置初始背景
              ,
            notice: true //是否开启桌面消息提醒，默认false
          });
          that.layim = layim;

          //   }


          w.onmessage = (res) => {
            // alert("数据已接收...");
            // console.log(res)
            that.layim.getMessage(JSON.parse(res.data))
          };
          that.layim.on('sendMessage', (res) => {
            //   let a = new Date().getTime()
            //   console.log(res,w,w.readyState)

            //   let w = websocket;
            if (w.readyState == 1) {
              w.send(JSON.stringify(res));
            }
            //   this.timestamp = a//new Date().getTime()//res.to.timestamp
            //通过websocket发给后台MsgScoketHandle.handleMessage这个接口
          });

          sessionStorage.setItem('wsStatus', 'success')
          that.wsStatus = 'success';
          that.$store.commit('checkWs', 'success')
          that.$message.success('通讯服务已连接')

          if (that.$store.state.type) {
            that.chatWith();
          }
        });
      },
      connectWebSocket(type) {

        // // let url = `ws://172.16.5.231:9090/dcp/webSocketServer?userName=${this.username}`;
        // let url =`ws://${window.location.host}/dcp/webSocketServer?userName=${this.username}`;
        // if(!websocket){
        if ('WebSocket' in window) {
          websocket = new WebSocket(this.wsUrl);
        } else if ('MozWebSocket' in window) {
          websocket = new MozWebSocket(this.wsUrl);
        }
        // console.log(websocket)
        websocket.onopen = () => {
          if (websocket) {
            this.initIm(type, websocket);
          }
        };

        websocket.onclose = (e) => {
          console.log(e, 2)
          sessionStorage.removeItem('wsStatus')
          this.$store.commit('checkWs', '')
          this.wsStatus = '';
          websocket = '';
          this.$message.error('通讯服务已关闭')
          setTimeout(() => {
            if (this.$route.path !== '/login') {
              this.$message.error('通讯服务已关闭,请重新登录')
              //   layer.closeAll();
              //   this.connectWebSocket('error');
            }
          }, 500)

          //   this.connectWebSocket();
        };
        websocket.onerror = (e) => {
          console.log(e, 1)
          sessionStorage.removeItem('wsStatus')
          this.$store.commit('checkWs', '')
          this.wsStatus = '';
          websocket = '';
          this.$message.error('通讯服务发送错误')
          setTimeout(() => {
            if (this.$route.path !== '/login') {
              this.$message.warning('通讯服务发送错误,请重新登录');
              //   layer.closeAll();
              //   this.connectWebSocket('error');
            }
          }, 500)
          //connectWebSocket();
        };
        // }
        //   this.websocket.onmessage = function (res) {
        //        alert("数据已接收...");
        //     /*  if(typeof res.data=== String){
        // 	   console.log("Received data string")
        //    }
        //    if(res.data instanceof ArrayBuffer){
        // 	    var buffer = res.data;
        // 	    console.log("Received arraybuffer");
        // 	  } */
        //     // layui.use('layim', function (layim) {
        //         console.log(res.data)
        //       layim.getMessage(JSON.parse(res.data))
        //     // });
        //   };
        // }
        // })
        // $.ajax({
        //   url: "dcp/this.websocket/login",
        //   type: "POST",
        //   dataType: "json",
        //   data: params,
        //   success: function (data) {
        //     if (!this.websocket) {
        //       if ('WebSocket' in window) {
        //         this.websocket = new WebSocket("ws://" + window.location.host + "/dcp/webSocketServer");
        //       } else if ('MozWebSocket' in window) {
        //         this.websocket = new MozWebSocket("ws://" + window.location.host + "/dcp/webSocketServer");
        //       }
        //       that.initIm();
        //       this.websocket.onmessage = function (res) {
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
        //       this.websocket.onclose = function (e) {
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
      chatWith() {
        this.vloading = false;
        this.$store.commit('setType', '')
        this.$store.commit('getChat', '') //
        //  this.$store.commit('checkWs','')
        httpAjax('user/findOnline').then(res => {
          let support = res[0]
          //   layui.use('layim',  (layim)=> {
          this.layim.chat({ //配置to的信息,即接收者的信息
            name: support.name,
            type: 'friend',
            avatar: support.avatar,
            id: support.id,
            status: "online"
          })
          //   });
        })
      },
      changeUse() {
        this.$store.commit('changeUse')
      },
      handleCommand(type) {
        if (type === 'quit') {
          // this.layim.setChatMin();
          this.quit()
        } else if (type === 'online') {
          this.chatWith();
        } else {
          this.$router.push({
            path: '/pwdPage',
          })
        }
      },

      quit() { //主动退出时
        removeToKen()
        this.$store.commit('removeTab') //移除tab
        this.$store.commit('setType', '') //移除wi过来的type=online
        this.$store.commit('checkWs', '') //移除首页正在连接中的状态
        this.$store.commit('getChat', '') //移除首页点击在线帮助后的状态
        this.$store.commit('changeUse', 1) //移除side menu状态
        this.$store.commit('resetFileAll') //resetFileAll
        if (websocket) {
          websocket.close();
        }
        websocket = ''
        this.$router.push({
          path: '/login',
        })
        layer.closeAll();
      },
      skinPeelerChange(index) {
        var skinLink = document.getElementById('skinBackground')
        if (index) {
          this.type = index;
          $(skinLink).attr('href', `static/css/skin${index}.css`)
          sessionStorage.setItem('skinColor', index)

        } else {
          //   var skinIndex = sessionStorage.getItem('skinColor')
          sessionStorage.setItem('skinColor', 5)
          //   this.type = skinIndex - 0;
          //   if (skinIndex != undefined || skinIndex != null) {
          //     $(skinLink).attr('href', `static/css/skin${skinIndex}.css`)
          //   } else {
          $(skinLink).attr('href', `static/css/skin5.css`)
          //   }
        }

      }
    },
    beforeDestroy() { //进到404等不该进入页面或者401倍弹出
      //   if (websocket) {
      //     websocket.close();
      //   }
      //   websocket = ''
      //   layer.closeAll();
      removeToKen()
      this.$store.commit('removeTab') //移除tab
      this.$store.commit('setType', '') //移除wi过来的type=online
      this.$store.commit('checkWs', '') //移除首页正在连接中的状态
      this.$store.commit('getChat', '') //移除首页点击在线帮助后的状态
      this.$store.commit('changeUse', 1) //移除side menu状态
      this.$store.commit('resetFileAll') //resetFileAll
      if (websocket) {
        websocket.close();
      }
      websocket = ''
      layer.closeAll();
      // alert(1)
    },
  }

</script>

<style scoped>
  .iconff {
    font-size: 19px;
  }

  #header {
    height: 56px;
    line-height: 56px;
    color: #bfcbd9;
    padding-right: 0px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    position: relative;
    /* border-bottom: 1px solid gainsboro;#42b983 */
  }

  #header::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 2px;
    /* background: #347ea2; */
  }

  .logo {
    display: flex;
    align-items: center;
    margin-left: 18px;
    flex: 1;
    overflow: hidden;
    /* flex:0 0 calc(100% - 290px); */
    /* width: calc(100% - 290px); */
  }

  .logo span {
    font-size: 20px;
    padding-left: 20px;
    /* font-family:cursive; */

  }

  .header-list {
    font-size: 16px;
    display: flex;
    height: 56px;
    /* padding: 0 20px; */
    /* flex:0 0 270px; */
    /* flex:1 1 25%; */
    margin-left: 20px;
    margin-right: 10px;
  }

  .iconfont {
    color: #bfcbd9;
  }

  .li-header-item {
    padding: 0 10px;
  }

  .user-name {
    padding-left: 10px;
    color: #606266;
    font-size: 18px;
    /* margin-right: 20px; */
    cursor: pointer;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .userAvatar {
    cursor: pointer;

  }

  .skin-main {
    position: relative;
    height: 56px;
    margin-right: 10px;
  }

  .skin-main:hover .skin-main-btn {
    opacity: 1;
    left: -170px;
  }

  .skin-main-btn {
    opacity: 1;
    width: 180px;
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: 200px;
    top: 48px;
    color: #000;
    z-index: 101;
    padding: 10px;
    box-shadow: 0 0 10px #999;
    background: #fff;
    border-radius: 4px;
    transition: all 1s;
  }

  .skin-main-btn span {
    float: left;
    cursor: pointer;
    /* margin: 0 5px; */
    line-height: 30px;
  }

  .skin-main-btn i {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
  }

  /* .skin-orange {
    background: rgb(255, 184, 1)
  }

  .skin-black {
    background: #39374b;
  }

  .skin-red {
    background: #ff326c;
  }

  .skin-blue {
    background: #535cf4;
  } */

  .skin-my {
    background: #304156;
    margin: 0 auto;
  }

  .skin-huawei {
    background: #296683;
    margin: 0 auto;

  }

  .fzicon {
    color: #296683;
    margin-right: 10px;
    cursor: pointer;
    font-size: 26px;
    margin-top: 3px;
  }

  /* .skin-active-enter-active,
  .skin-active-leave-active {
    transition: opacity 2s;
  }

  .skin-active-enter,
  .skin-active-leave-to {
    opacity: 0;
  } */

  .header-quit {
    padding-right: 10px;
  }

  /* @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  } */

  /* .rotateI {
    animation: rotate 8s linear infinite;
    cursor: pointer;
  }

  .rotateI:hover {
    animation-play-state: paused
  } */

  /* .el-dropdown-link {
    cursor: pointer;
  } */
  /* .tagView{
    position: relative;
}
.tagView::after{
    position: absolute;
    width: 100%;;
} */

</style>
