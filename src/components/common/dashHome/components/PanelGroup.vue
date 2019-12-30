<template>
  <el-row :gutter="40" class="panel-group">
     <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <div class="icon-shopping card-panel-icon" >
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg"><path d="M96.258 57.462h31.421C124.794 27.323 100.426 2.956 70.287.07v31.422a32.856 32.856 0 0 1 25.971 25.97zm-38.796-25.97V.07C27.323 2.956 2.956 27.323.07 57.462h31.422a32.856 32.856 0 0 1 25.97-25.97zm12.825 64.766v31.421c30.46-2.885 54.507-27.253 57.713-57.712H96.579c-2.886 13.466-13.146 23.726-26.292 26.291zM31.492 70.287H.07c2.886 30.46 27.253 54.507 57.713 57.713V96.579c-13.466-2.886-23.726-13.146-26.291-26.292z"/></svg>
          </div>
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">在线桌面</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
           <div class="icon-peoples card-panel-icon" >
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg"><path d="M71.984 44.815H115.9L71.984 9.642v35.173zM16.094.05h63.875l47.906 38.37v76.74c0 3.392-1.682 6.645-4.677 9.044-2.995 2.399-7.056 3.746-11.292 3.746H16.094c-4.236 0-8.297-1.347-11.292-3.746-2.995-2.399-4.677-5.652-4.677-9.044V12.84C.125 5.742 7.23.05 16.094.05zm71.86 102.32V89.58h-71.86v12.79h71.86zm23.952-25.58V64H16.094v12.79h95.812z"/></svg>
          </div>
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已申请桌面</div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
           <div class="icon-message card-panel-icon" >
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg"><path d="M1.482 70.131l36.204 16.18 69.932-65.485-61.38 70.594 46.435 18.735c1.119.425 2.397-.17 2.797-1.363v-.085L127.998.047 1.322 65.874c-1.12.597-1.519 1.959-1.04 3.151.32.511.72.937 1.2 1.107zm44.676 57.821L64.22 107.26l-18.062-7.834v28.527z"/></svg>

          </div>
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已清退桌面</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
           <div class="icon-money card-panel-icon" >
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg"><path d="M95.648 118.762c0 5.035-3.563 9.121-7.979 9.121H7.98c-4.416 0-7.979-4.086-7.979-9.121C0 100.519 15.408 83.47 31.152 76.75c-9.099-6.43-15.216-17.863-15.216-30.987v-9.128c0-20.16 14.293-36.518 31.893-36.518s31.894 16.358 31.894 36.518v9.122c0 13.137-6.123 24.556-15.216 30.993 15.738 6.726 31.141 23.769 31.141 42.012z"/><path d="M106.032 118.252h15.867c3.376 0 6.101-3.125 6.101-6.972 0-13.957-11.787-26.984-23.819-32.123 6.955-4.919 11.638-13.66 11.638-23.704v-6.985c0-15.416-10.928-27.926-24.39-27.926-1.674 0-3.306.193-4.89.561 1.936 4.713 3.018 9.974 3.018 15.526v9.121c0 13.137-3.056 23.111-11.066 30.993 14.842 4.41 27.312 23.42 27.541 41.509z"/></svg>

          </div>
          <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">登录次数</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
   
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    svg{
      fill: currentColor;
      width: 128px;
      height: 128px;
      // transform: scale(.5)
    }
    height: 120px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper, {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;color: #fff;
      }
      .icon-message {
        background: #36a3f7;color: #fff;
      }
      .icon-money {
        background: #f4516c;color: #fff;
      }
      .icon-shopping {
        background: #34bfa3;color: #fff;
      }
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
    transform: scale(0.7);
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
      transform: scale(.5);
    transform-origin: 0 0;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
