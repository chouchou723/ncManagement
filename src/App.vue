<template>
	<div id="app">
        <transition mode="out-in">
		<router-view></router-view>
        </transition>
	</div>
</template>

<script>

export default {

}
</script>
<style>
#app{
    background: white;
}
.v-enter{
 opacity: 0;
}
.v-enter-active{
 transition: 0.5s;
}
.v-enter-to{
 opacity: 1;
}
.v-leave{
 opacity: 1;
}
.v-leave-to{
 opacity:0;
}
.v-leave-active{
 transition: 0.5s;
}
body .el-zoom-in-top-enter-active{
    /* transform: none; */
    /* transition: opacity .3s ease-in-out,-webkit-transform .3s linear; */
    transition: opacity .3s cubic-bezier(.23,1,.32,1)
}
</style>




