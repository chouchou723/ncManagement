<template>
  <div>

    <div style="font-size: 24px;color: #666;font-weight:600;margin:10px 0 20px">快捷菜单</div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/cloudOnline')">
          <div class="card-panel-icon-wrapper icon-shopping ">
            <div class="icon-shopping card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.482 70.131l36.204 16.18 69.932-65.485-61.38 70.594 46.435 18.735c1.119.425 2.397-.17 2.797-1.363v-.085L127.998.047 1.322 65.874c-1.12.597-1.519 1.959-1.04 3.151.32.511.72.937 1.2 1.107zm44.676 57.821L64.22 107.26l-18.062-7.834v28.527z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">在&nbsp;线&nbsp;资&nbsp;源
            <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">桌面申请</div> -->
            <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/cloudApplied')">
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
            待&nbsp;审&nbsp;批
            <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">已清退桌面</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col ">
        <div class="card-panel" @click="handleSetLineChartData('/merchandiseSetting')">
          <div class="card-panel-icon-wrapper icon-help">
            <div class="icon-help card-panel-icon">
              <!-- <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M71.984 44.815H115.9L71.984 9.642v35.173zM16.094.05h63.875l47.906 38.37v76.74c0 3.392-1.682 6.645-4.677 9.044-2.995 2.399-7.056 3.746-11.292 3.746H16.094c-4.236 0-8.297-1.347-11.292-3.746-2.995-2.399-4.677-5.652-4.677-9.044V12.84C.125 5.742 7.23.05 16.094.05zm71.86 102.32V89.58h-71.86v12.79h71.86zm23.952-25.58V64H16.094v12.79h95.812z" />
            </svg> -->
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M106.133 67.2a4.797 4.797 0 0 0-4.8 4.8c0 .187.014.36.027.533h-.027V118.4H9.6V26.667h50.133c2.654 0 4.8-2.147 4.8-4.8 0-2.654-2.146-4.8-4.8-4.8H9.6a9.594 9.594 0 0 0-9.6 9.6V118.4c0 5.307 4.293 9.6 9.6 9.6h91.733c5.307 0 9.6-4.293 9.6-9.6V72.533h-.026c.013-.173.026-.346.026-.533 0-2.653-2.146-4.8-4.8-4.8z" />
                <path
                  d="M125.16 13.373L114.587 2.8c-3.747-3.747-9.854-3.72-13.6.027l-52.96 52.96a4.264 4.264 0 0 0-.907 1.36L33.813 88.533c-.746 1.76-.226 3.534.907 4.68 1.133 1.147 2.92 1.667 4.693.92l31.4-13.293c.507-.213.96-.52 1.36-.907l52.96-52.96c3.747-3.746 3.774-9.853.027-13.6zM66.107 72.4l-18.32 7.76 7.76-18.32L92.72 24.667l10.56 10.56L66.107 72.4zm52.226-52.227l-8.266 8.267-10.56-10.56 8.266-8.267.027-.026 10.56 10.56-.027.026z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            商&nbsp;品&nbsp;配&nbsp;置
            <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">登录次数</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down">
        <div class="card-panel" @click="handleSetLineChartData('/cloudFailed')">
          <div class="card-panel-icon-wrapper icon-people">
            <div class="icon-peoples card-panel-icon">
              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M54.857 118.857h64V73.143H89.143c-1.902 0-3.52-.668-4.855-2.002-1.335-1.335-2.002-2.954-2.002-4.855V36.57H54.857v82.286zM73.143 16v-4.571a2.2 2.2 0 0 0-.677-1.61 2.198 2.198 0 0 0-1.609-.676H20.571c-.621 0-1.158.225-1.609.676a2.198 2.198 0 0 0-.676 1.61V16a2.2 2.2 0 0 0 .676 1.61c.451.45.988.676 1.61.676h50.285c.622 0 1.158-.226 1.61-.677.45-.45.676-.987.676-1.609zm18.286 48h21.357L91.43 42.642V64zM128 73.143v48c0 1.902-.667 3.52-2.002 4.855-1.335 1.335-2.953 2.002-4.855 2.002H52.57c-1.901 0-3.52-.667-4.854-2.002-1.335-1.335-2.003-2.953-2.003-4.855v-11.429H6.857c-1.902 0-3.52-.667-4.855-2.002C.667 106.377 0 104.759 0 102.857v-96c0-1.902.667-3.52 2.002-4.855C3.337.667 4.955 0 6.857 0h77.714c1.902 0 3.52.667 4.855 2.002 1.335 1.335 2.003 2.953 2.003 4.855V30.29c1 .622 1.856 1.29 2.569 2.003l29.147 29.147c1.335 1.335 2.478 3.145 3.429 5.43.95 2.287 1.426 4.383 1.426 6.291v-.018z" />
              </svg>

            </div>
            <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          </div>
          <div class="card-panel-description">
            失&nbsp;败&nbsp;工&nbsp;单
            <div class="showGoto">点击前往 <i class="el-icon-arrow-right"></i></div>
            <!-- <div class="card-panel-text">已申请桌面</div> -->
            <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down">
        <div class="card-panel" @click="handleSetLineChartData('/cloudTicket')">
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
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col hidden-mid-and-down">
        <div class="card-panel" @click="handleSetLineChartData('/cloudRecycle')">
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
      return {}
    },
    methods: {
      handleSetLineChartData(type) {
        this.$router.push(type)
      }
    },
    created() {},
    computed: {},
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
