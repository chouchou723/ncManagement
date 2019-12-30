<template>
  <div>

    <div style="font-size: 24px;color: #666;font-weight:600;margin:10px 0 20px">快捷菜单</div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/desktopApply')">
          <div class="card-panel-icon-wrapper icon-shopping ">
            <div class="icon-shopping card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.482 70.131l36.204 16.18 69.932-65.485-61.38 70.594 46.435 18.735c1.119.425 2.397-.17 2.797-1.363v-.085L127.998.047 1.322 65.874c-1.12.597-1.519 1.959-1.04 3.151.32.511.72.937 1.2 1.107zm44.676 57.821L64.22 107.26l-18.062-7.834v28.527z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">桌&nbsp;面&nbsp;申&nbsp;请
               <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">桌面申请</div> -->
            <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/myDesk')">
          <div class="card-panel-icon-wrapper icon-message">
            <div class="icon-message card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M71.984 44.815H115.9L71.984 9.642v35.173zM16.094.05h63.875l47.906 38.37v76.74c0 3.392-1.682 6.645-4.677 9.044-2.995 2.399-7.056 3.746-11.292 3.746H16.094c-4.236 0-8.297-1.347-11.292-3.746-2.995-2.399-4.677-5.652-4.677-9.044V12.84C.125 5.742 7.23.05 16.094.05zm71.86 102.32V89.58h-71.86v12.79h71.86zm23.952-25.58V64H16.094v12.79h95.812z" />
              </svg>



            </div>
            <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            我&nbsp;的&nbsp;桌&nbsp;面
             <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">已清退桌面</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col " v-if="localRole==='user'||localRole==='asset'">
        <div class="card-panel" @click="handleSetLineChartData('online')">
          <div class="card-panel-icon-wrapper icon-help">
            <div class="icon-help card-panel-icon">
              <!-- <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M71.984 44.815H115.9L71.984 9.642v35.173zM16.094.05h63.875l47.906 38.37v76.74c0 3.392-1.682 6.645-4.677 9.044-2.995 2.399-7.056 3.746-11.292 3.746H16.094c-4.236 0-8.297-1.347-11.292-3.746-2.995-2.399-4.677-5.652-4.677-9.044V12.84C.125 5.742 7.23.05 16.094.05zm71.86 102.32V89.58h-71.86v12.79h71.86zm23.952-25.58V64H16.094v12.79h95.812z" />
            </svg> -->
              <svg style="margin-top: 9px;" width="128" height="110" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M86.635 33.334c1.467 0 2.917.113 4.358.283C87.078 14.392 67.58.111 45.321.111 20.44.111.055 17.987.055 40.687c0 13.104 6.781 23.863 18.115 32.209l-4.527 14.352 15.82-8.364c5.666 1.182 10.207 2.395 15.858 2.395 1.42 0 2.829-.073 4.227-.189-.886-3.19-1.398-6.53-1.398-9.996 0-20.845 16.98-37.76 38.485-37.76zm-24.34-12.936c3.407 0 5.665 2.363 5.665 5.954 0 3.576-2.258 5.97-5.666 5.97-3.392 0-6.795-2.395-6.795-5.97 0-3.591 3.403-5.954 6.795-5.954zM30.616 32.323c-3.393 0-6.818-2.395-6.818-5.971 0-3.591 3.425-5.954 6.818-5.954 3.392 0 5.65 2.363 5.65 5.954 0 3.576-2.258 5.97-5.65 5.97z" />
                <path
                  d="M127.945 70.52c0-19.075-18.108-34.623-38.448-34.623-21.537 0-38.5 15.548-38.5 34.623 0 19.108 16.963 34.622 38.5 34.622 4.508 0 9.058-1.2 13.584-2.395l12.414 7.167-3.404-11.923c9.087-7.184 15.854-16.712 15.854-27.471zm-50.928-5.97c-2.254 0-4.53-2.362-4.53-4.773 0-2.378 2.276-4.771 4.53-4.771 3.422 0 5.665 2.393 5.665 4.771 0 2.41-2.243 4.773-5.665 4.773zm24.897 0c-2.24 0-4.498-2.362-4.498-4.773 0-2.378 2.258-4.771 4.498-4.771 3.392 0 5.665 2.393 5.665 4.771 0 2.41-2.273 4.773-5.665 4.773z" />
                </svg>

            </div>
            <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            在&nbsp;线&nbsp;帮&nbsp;助
            <div style="position: absolute;bottom: -25px;font-size:12px;width: 100%;text-align: center;color:#9b9c95"
              v-if="title">正在连接ing...</div>
            <!-- <div class="card-panel-text">登录次数</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col" v-if="localRole!=='user'&&localRole!=='asset'">
        <div class="card-panel" @click="handleSetLineChartData('/deskRecycle')">
          <div class="card-panel-icon-wrapper icon-money">
            <div class="icon-money card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M96.258 57.462h31.421C124.794 27.323 100.426 2.956 70.287.07v31.422a32.856 32.856 0 0 1 25.971 25.97zm-38.796-25.97V.07C27.323 2.956 2.956 27.323.07 57.462h31.422a32.856 32.856 0 0 1 25.97-25.97zm12.825 64.766v31.421c30.46-2.885 54.507-27.253 57.713-57.712H96.579c-2.886 13.466-13.146 23.726-26.292 26.291zM31.492 70.287H.07c2.886 30.46 27.253 54.507 57.713 57.713V96.579c-13.466-2.886-23.726-13.146-26.291-26.292z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">回&nbsp;收&nbsp;站
               <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">桌面申请</div> -->
            <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down">
        <div class="card-panel" @click="handleSetLineChartData('/myOrder')">
          <div class="card-panel-icon-wrapper icon-people">
            <div class="icon-peoples card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M95.648 118.762c0 5.035-3.563 9.121-7.979 9.121H7.98c-4.416 0-7.979-4.086-7.979-9.121C0 100.519 15.408 83.47 31.152 76.75c-9.099-6.43-15.216-17.863-15.216-30.987v-9.128c0-20.16 14.293-36.518 31.893-36.518s31.894 16.358 31.894 36.518v9.122c0 13.137-6.123 24.556-15.216 30.993 15.738 6.726 31.141 23.769 31.141 42.012z" />
                <path
                  d="M106.032 118.252h15.867c3.376 0 6.101-3.125 6.101-6.972 0-13.957-11.787-26.984-23.819-32.123 6.955-4.919 11.638-13.66 11.638-23.704v-6.985c0-15.416-10.928-27.926-24.39-27.926-1.674 0-3.306.193-4.89.561 1.936 4.713 3.018 9.974 3.018 15.526v9.121c0 13.137-3.056 23.111-11.066 30.993 14.842 4.41 27.312 23.42 27.541 41.509z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            我&nbsp;的&nbsp;申&nbsp;请
             <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">已申请桌面</div> -->
            <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down">
        <div class="card-panel" @click="handleSetLineChartData('/myTicket')">
          <div class="card-panel-icon-wrapper icon-cloud">
            <div class="icon-cloud card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M78.208 16.576v8.384h38.72v5.376h-38.72v8.704h38.72v5.376h-38.72v8.576h38.72v5.376h-38.72v8.576h38.72v5.376h-38.72v8.576h38.72v5.376h-38.72v8.512h38.72v5.376h-38.72v11.136H128v-94.72H78.208zM0 114.368L72.128 128V0L0 13.632v100.736z" />
                <path
                  d="M28.672 82.56h-11.2l14.784-23.488-14.08-22.592h11.52l8.192 14.976 8.448-14.976h11.136l-14.08 22.208L58.368 82.56H46.656l-8.768-15.68z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            工&nbsp;单&nbsp;列&nbsp;表
             <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">已申请桌面</div> -->
            <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down" v-if="localRole==='user'||localRole==='asset'">
        <div class="card-panel" @click="handleSetLineChartData('/deskRecycle')">
          <div class="card-panel-icon-wrapper icon-money">
            <div class="icon-money card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M96.258 57.462h31.421C124.794 27.323 100.426 2.956 70.287.07v31.422a32.856 32.856 0 0 1 25.971 25.97zm-38.796-25.97V.07C27.323 2.956 2.956 27.323.07 57.462h31.422a32.856 32.856 0 0 1 25.97-25.97zm12.825 64.766v31.421c30.46-2.885 54.507-27.253 57.713-57.712H96.579c-2.886 13.466-13.146 23.726-26.292 26.291zM31.492 70.287H.07c2.886 30.46 27.253 54.507 57.713 57.713V96.579c-13.466-2.886-23.726-13.146-26.291-26.292z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">回&nbsp;收&nbsp;站
               <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">桌面申请</div> -->
            <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  // import CountTo from 'vue-count-to'

  export default {
    components: {
      // CountTo
    },
    data() {
      return {
        title: false
      }
    },
    computed: {
      localRole() {
        return sessionStorage.getItem('role')
      },
    },
    methods: {
      handleSetLineChartData(type) {
        if (type !== 'online') {
          this.$router.push(type)
        } else {
          if (sessionStorage.getItem('wsStatus') === 'success') {
            // setTimeout(() => {
            this.$store.commit('getChat', 'start') //通知header打开聊天chatStatus
            // }, 100)
          } else {
            this.$message.warning('通讯服务正在连接中...')
          }
        }
      }
    },
    created() {
      if (sessionStorage.getItem('wsStatus') === 'success') {
        this.title = false;
      } else {
        this.title = true;
      }
    },
    watch: {
      '$store.state.checkWs'(n, o) { //根据header状态,改标题checkWs
        if (n === 'success') {
          this.title = false;
        } else {
          this.title = true;

        }
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 15px;

    // .card-panel-col {
    //   margin-bottom: 12px;
    // }
    @media screen and (max-width: 1280px) {
      .hidden-mid-and-down {
        display: none !important;
      }
    }

    .card-panel {
      svg {
        fill: currentColor;
        width: 128px;
        height: 128px;
        // transform: scale(.5)
      }
// border:1px solid gainsboro;
      height: 120px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);
      //   border-color: rgba(0, 0, 0, .1);
      border-radius: 5px;
padding: 0 0 0 7%;
      // padding: 0 15%;
      &:hover {
        box-shadow: 0 0 20px rgba(0, 0, 0, .2);

        .card-panel-icon-wrapper,
          {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
          color: #fff;
        }

        .icon-message {
          background: #36a3f7;
          color: #fff;
        }

        .icon-money {
          background: #f4516c;
          color: #fff;
        }

        .icon-cloud {
          background: #ffb980;
          color: #fff;
        }

        .icon-shopping {
          background: #34bfa3;
          color: #fff;
        }

        .icon-help {
          background: #b6a2de;
          color: #fff;
        }
      }

      .icon-help {
        color: #b6a2de;
      }

      .icon-cloud {
        color: #ffb980;
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 16px 0 0 0;
        padding: 10px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        width: 66px;
        height: 66px;
        //   transform-origin: 0% 0%;
        // transform: scale(0.5);
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
        transform: scale(.5);
        transform-origin: 0 0;
      }

      .card-panel-description {
        //   float: right;
        font-weight: bold;
        position: relative;
        //   margin: 26px;
        margin-left: 100px;
        text-align: center;
        height: 100%;
        line-height: 120px;
        font-size: 23px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
         .showGoto {
          position: absolute;
          bottom: -40px;
          right: 20px;
          font-size: 12px;
          text-align: center;
          color: #9b9c95;
          display: none;
        }

        &:hover {
          .showGoto {
            display: inline-block;
          }
        }
      }
    }
  }

</style>
