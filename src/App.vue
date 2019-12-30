<template>
	<div id="app">
		<router-view></router-view>
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
body .el-zoom-in-top-enter-active{
    /* transform: none; */
    /* transition: opacity .3s ease-in-out,-webkit-transform .3s linear; */
    transition: opacity .3s cubic-bezier(.23,1,.32,1)
}
</style>




