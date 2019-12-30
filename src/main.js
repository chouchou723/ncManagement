import Vue from 'vue'
// import iView from 'iview'
// import 'iview/dist/styles/iview.css'
import router from './router'
import App from './App'
import store from './store/index'
import ElementUI from 'element-ui';
import './assets/css/themeO/index.css';
// import '../static/theme2/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
// import './assets/css/themeO/display.css';
Vue.use(ElementUI)
window.setNotice = Vue.prototype.$message
// import Chat from './components/common/vueBeautifulChat/src/index'
// Vue.use(Chat)
// 公共 loading 组件 
// import psloading from './components/loading'

// Vue.component('psloading', psloading)
import './routerbeforch.js'

// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/chart/funnel';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/chart/bar';

import 'assets/css/reset.css'

// import 'assets/iconfont/iconfont.css'
import 'assets/fontIcon/iconfont.css'

import 'assets/css/jquery.mCustomScrollbar.css'
import 'assets/js/jquery.mCustomScrollbar.concat.min.js'

import 'common/css/main.css'
import 'common/css/common.css'

// Vue.use(iView);

// var vm = new Vue({
// 	el: '#app',
// 	router,
// 	store,
// 	template: '<App/>',
// 	components: { App }
// })
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

// vm.$Notice.config({
// 	top: 300,
// 	duration: 2.5
// })

// vm.$Message.config({
//     top: 100,
//     duration: 2.5
// });


