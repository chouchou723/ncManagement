<template>
    <div id="home">
            <v-menu></v-menu>
		<div id="content" :style="showHide?'margin-left:64px':'margin-left:200px'">
        <v-header></v-header>
        <!-- <tags-view /> -->
            <router-view :key="onlyKey" class="right-content"></router-view>
		</div>
        <!-- <vFooter></vFooter> -->
    </div>
</template>

<script>

import vHeader from './header'
import vMenu from './menu'
import TagsView from './TagsView/'
//import vFooter from './footer'

export default {
    name: 'home',
    computed:{
        onlyKey(){
            return this.$store.state.renderViewKey
        },
        showHide(){
            return this.$store.state.canUse
        }
    },
    components:{
        vHeader,
        vMenu,TagsView
    }
}
</script>

<style scoped>
#home{
      display: flex;
        /* flex-direction: column; */
        height: 100%;
        width: 100%;
        /* overflow: hidden; */
}
#content{
    position: relative;
    width: 100%;
    /* left: 0; */
    /* top: 45px; */
    /* bottom: 0;   */
    display: flex; 
    flex-direction: column;
    margin-left:200px;
    overflow: hidden;
    height: 100%;
    transition: all .3s;
    /* display: -webkit-flex;  */
}
.right-content{overflow:hidden;flex:1;height:100%;background: #f7f7f7;padding: 10px 15px 0px 15px;position: relative;}
</style>

