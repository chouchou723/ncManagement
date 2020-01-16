<template>
<div id="menuList">


    <!-- <div id="menuList" ref="controlMenu" > -->
    <!-- <div class="guide-main" @click="menuControl">
                                <i :class="menuClass"></i>
                                <span class="one-item">功能导航</span>
                                <i class="iconfont icon-arrow-fine-left"></i>
                            </div> -->
    <el-menu :default-active="$route.path" text-color="#bfcbd9" class="el-menu-vertical-demo" @select="refreshClick"
      :collapse="showHide" router :default-openeds='defaultOpeneds'>
      <!-- <el-menu-item index="/dashboard">
        <i class="el-icon-menu iconfont1" ref="menuColor"></i>
        <span slot="title" class="one-item">DCMPortal</span>
      </el-menu-item> -->
      <div class="topTitle">
           <!-- <i class="el-icon-menu iconfont1" ref="menuColor"></i>
        <span slot="title" class="one-item">DCMPortal</span> -->
        <img src="../../assets/img/logoT.png" alt="" class="topImg">
      </div>
  <el-scrollbar wrap-class="scrollbar-wrapper" id="scrollWrap" >
      <el-submenu :index="item.url" :name="item.id" v-for="(item,index) in menuConfig" :key="index">
        <template slot="title">
          <!-- <div style="display:flex"> -->
            <i :class="currClass(item)"></i>
            <span  slot="title">{{item.text}}</span>
          <!-- </div> -->
        </template>
        <el-menu-item :index="group.url" :name="group.id" v-for="(group,index) in item.children" :key="index">
          <div class="two-item">
            {{group.text}}
          </div>
          <!-- <router-link class="two-item" :to="group.url"> -->
          <!-- </router-link> -->
        </el-menu-item>
      </el-submenu>
    
  </el-scrollbar>
       <!-- <el-menu-item> -->
           <!-- <div style="display:flex;justify-content:flex-end;align-items:center;height:100%;padding-right:20px;">
        <i class="el-icon-back iconfont1" ref="menuColor" style="margin-right:0"></i>
        <span slot="title" class="one-item"></span>

           </div> -->
      <!-- </el-menu-item> -->
    </el-menu>
    <!-- <Menu @on-select="aaa" ref="menuList" :open-names="[openIndex]" active-name="1-1" accordion>
            <Submenu :name="item.id" v-for="(item,index) in menuConfig" :key="index">
<template slot="title">
    <i :class="currClass(item)" :style="{'font-size':item.size,'padding-left':item.padLeft}"></i>
    <span :style="{'padding-left': item.textPadding}" class="menuTitle">{{item.text}}</span>
</template>
            <MenuItem :name="group.id" v-for="(group,index) in item.children" :key="index" style="padding-left:0;">
                <router-link @click.native="refreshClick(group.url)" class="two-item" :to="group.url">{{group.text}}</router-link>
            </MenuItem>
        </Submenu>
    </Menu> -->
    <!-- </div> -->
    <div style="display:flex;justify-content:flex-end;align-items:center;height:56px;padding-right:20px;position:absolute;right:0;bottom:0;">
        <i class="el-icon-back iconfont1 iconC" :style="$store.state.canUse?'transform: rotate(180deg);':'transform: rotate(0);'" @click="changeUse"></i>

           </div>
  </div>
</template>

<script>
  import adminConfig from 'common/js/admin-config'
  import tenantConfig from 'common/js/tenant-config'
  import userConfig from 'common/js/user-config'
  import assetConfig from 'common/js/asset-config'
  import onlineConfig from 'common/js/online-config'
  
//   let liItemHeight = 45
  export default {
    name: 'menuList',
    data() {
      return {
        menuConfig: [],
         defaultOpeneds: [],
        // showHide: false,
        openIndex: '1',
        defaultActive: '',
        fontColor: '#3d3e04',
        changeHide: false,
      }
    },
    created() {
      this.getLoginJurisdiction();
    },
    mounted() {
    //   let color = getComputedStyle(this.$refs.menuColor).getPropertyValue("color");
      //   document.querySelector('.router-link-active').style.cssText += `background:${color}`
      // console.log(color)
      // if(color){
      //    this.fontColor= this.colorRGB2Hex(color);
      //    console.log(this.fontColor)
      // }
      // console.log(getComputedStyle(this.$refs.menuColor).getPropertyValue("color"))
    },
    computed: {
      // menuClass() {
      //     return !this.showHide ? 'iconfont icon-caidan fzicon' : 'iconfont icon-zhankaicaidan fzicon';
      // },
      showHide() {
        return this.$store.state.canUse;
      },
      onRoutes() {
        return this.$route.path.replace('', '');
      },
      // fontColor() {
      // let color = getComputedStyle(this.$refs.menuColor).getPropertyValue("color");
      // console.log(color)
      // if(color){
      // return this.colorRGB2Hex(color)
      // }else{
      // return '#3d3e04'
      // }
      // }
    },
    methods: {
        changeUse() {
        this.$store.commit('changeUse')
      },
      // colorRGB2Hex(color) {
      //     var rgb = color.split(',');
      //     var r = parseInt(rgb[0].split('(')[1]);
      //     var g = parseInt(rgb[1]);
      //     var b = parseInt(rgb[2].split(')')[0]);
      //     var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      //     return hex;
      // },
      handleOpen(index, indexPath) {
        // console.log(index)
        //   if(this.$route.path===index){
        //       const key = new Date().getTime()
        //       this.$store.dispatch('setViewKey', key)
        //   }
      },
      currClass(data) {
        return `iconfont1 ${data.iconfont}`;
      },
      getLoginJurisdiction() {
        const stateCode = sessionStorage.getItem('role')
        //this.$store.state.stateCode
        switch (stateCode) {
          case 'admin':
            this.menuConfig = adminConfig;
            this.menuConfig.map(item => {
                        this.defaultOpeneds.push(item.url);
                    })
            break;
          case 'tenant':
            this.menuConfig = tenantConfig;
              this.menuConfig.map(item => {
                        this.defaultOpeneds.push(item.url);
                    })
            break;
         
          default:
            this.menuConfig = userConfig;
              this.menuConfig.map(item => {
                        this.defaultOpeneds.push(item.url);
                    })
            break;
        }
        // this.defaultActive = '1-1'
      },
      refreshClick(path) {
        const key = new Date().getTime()
        if (path === this.$route.path) {
          //   this.$router.push({
          //     path,
          //     query: {
          //       t: key
          //     }
          //   })
          this.$store.dispatch('setViewKey', key)
        }
      },
      // aaa(value) {
      //     this.openIndex = ''
      // },
      // menuControl() {
      //     if (this.showHide) {
      //         this.showHide = false;
      //     //     $(this.$refs.controlMenu).stop(true).animate({
      //     //     'min-width': '200px'
      //     // }, 600)
      //     } else {
      //         this.showHide = true;
      //     //     $(this.$refs.controlMenu).stop(true).animate({
      //     //     'min-width': '63px'
      //     // }, 370)
      //     }
      //     // setTimeout(()=>{
      //     //      if (this.changeHide) {
      //     //     this.changeHide = false
      //     // } else {
      //     //     this.changeHide = true
      //     // }
      //     // },200)
      //     // let listItem = $('.ivu-menu-light .ivu-menu')
      //     // if (this.showHide) {
      //     //     $(this.$refs.controlMenu).stop(true).animate({
      //     //         'min-width': '62px'
      //     //     }, 600)
      //     //     this.showHide = false
      //     //     $('.one-item, .ivu-menu-submenu-title-icon, .icon-arrow-fine-left').hide()
      //     //     for (var i = 0; i < listItem.length; i++) {
      //     //         $(listItem).hide()
      //     //     }
      //     //     $('.menuTitle').hide()
      //     // } else {
      //     //     $(this.$refs.controlMenu).stop(true).animate({
      //     //         'min-width': '200px'
      //     //     }, 600)
      //     //     // ()=>{
      //     //     // this.$refs.controlMenu.style.minWidth =  '200px';
      //     //     //})
      //     //     this.showHide = true
      //     //     setTimeout(() => {
      //     //         $('.one-item, .ivu-menu-submenu-title-icon, .icon-arrow-fine-left').show()
      //     //         $('.ivu-menu-submenu .ivu-menu').height('auto')
      //     //         $('.menuTitle').show()
      //     //     }, 600)
      //     // }
      // },
      // selectChange() {
      //     // console.log(2222)
      // },
    }
  }

</script>

<style>
  #menuList   .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
   height: 100%;    
  }
   #menuList   .el-menu-vertical-demo{
     border-right: none;
     height: 88%;
   }
  #menuList  .el-menu--collapse  .el-submenu__icon-arrow,#menuList .el-scrollbar__thumb{
    display: none;
}
 
  #menuList {
    height: 100%;
    /* min-width: 63px; */
    /* min-width: 200px; */
    /* background: #304156; */
    /* overflow: hidden; */
    position: fixed;
    top: 0;
    left: 0;
    /* box-shadow: 5px 0px 3px #e4dede; */
    z-index: 1999;
    /* padding-top: 20px; */
    /* transition: width .3s; */
    /* flex: 0 0 200px; */
  }
/* #menuList .el-submenu__title{ */
    /* overflow: hidden; */
/* } */
  /* #menuList::-webkit-scrollbar {
        display: none
    } */
  /* .pl22 {
        padding-left: 22px;
    } */

  /* #menuList .el-menu { */
    /* border-right: none; */
    /* transition: width .3s; */

  /* } */

  /* #menuList .el-menu--collapse .el-submenu {
    display: flex;
    justify-content: center;
  } */

  /* #menuList .el-menu--collapse { */
    /* overflow: hidden; */
    /* transition: border-color .3s,background-color .3s,color .3s,width .3s; */
  /* } */

  /* .ivu-menu.ivu-menu-light.ivu-menu-vertical {
        width: 100% !important;
    } */
  /* .one-item {
    padding-left: 0px;
    margin-right:23px;
  } */

  .two-item {
    padding-left: 24px;
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
  }

  /* #menuList .ivu-menu-vertical.ivu-menu-light:after {
        width: 0px;
    }
    #menuList .ivu-menu-vertical .ivu-menu-item,
    #menuList .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 0px;
    }
    #menuList .ivu-menu-item {
        height: 40px;
        line-height: 40px;
    } */
  #menuList .iconfont1 {
    /* vertical-align: middle; */
    color: #bfcbd9;
    width: 24px;
    font-size: 24px;
    margin-right: 16px;
    /* padding:0 20px; */
    text-align: center;
  }

  #menuList a {
    color: inherit;
  }
#menuList .iconC{
    margin-right: 0;
    cursor: pointer;
}
  .scrollbar-wrapper {
    overflow-x: hidden;
  }
 #menuList  .el-submenu__icon-arrow{
      color: #fff;
  }
  #scrollWrap{
      height: 78%;
      /* overflow-x: hidden; */
  }
  /* #menuList .ivu-menu-vertical .ivu-menu-submenu-title-icon {
        top: 16px;
        right: 14px;
    }
    #menuList .ivu-menu-submenu-title {
        padding-top: 0px;
        padding-bottom: 0px;
        height: 45px;
        line-height: 45px;
    } */
  /* #menuList .guide-main {
        height: 70px;
        line-height: 70px;
        cursor: pointer;
        border-bottom: 1px solid #eae8e8;
    }
    #menuList .guide-main span {
        padding-left: 16px;
    }
    #menuList .guide-main i:nth-of-type(1) {
        padding-left: 24px;
        font-size: 18px;
    }
    #menuList .guide-main i:nth-of-type(2) {
        padding-left: 32px;
        font-size: 18px;
    } */
  /* #menuList .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
    #menuList .ivu-menu-light.ivu-menu-vertical .ivu-menu-item {
        border-right: 0px;
    }
    .ivu-menu.ivu-menu-light.ivu-menu-vertical {
        width: auto;
    } */
.topTitle{
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    color: #bfcbd9;
}
.topImg{
    width: 60px;
}
</style>
