import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import {getToKen} from './utils/cookie' 
import store from './store'
import {
  httpAjax
} from 'api/common'

// const routerList = ['/login']

router.beforeEach((to, from, next) => {
  // var cookie = getToKen()
  NProgress.start() // 开启Progress
  const role = sessionStorage.getItem('role');
  if (!role) {
    if (to.path === '/login'||to.path === '/wiplus') { //如果去的就是login页面
      next()
    } else { //去的页面非login页
    //   const tokenName = to.query.name
    //   const tenantDomain = to.query.tenantDomain
    //   if (tokenName && tenantDomain) { //wi带参进来
    //     httpAjax('user/findUser', {
    //       name: tokenName,
    //       tenantDomain: tenantDomain
    //     }).then(res => {
    //       let rr = res.role||'user';
    //       sessionStorage.setItem('role', rr);
    //       sessionStorage.setItem('username', res.name);
    //       sessionStorage.setItem('avatar', res.avatar);
    //       sessionStorage.setItem('password', res.initialPassword);
    //       sessionStorage.setItem('domain', res.tenantDomain);
    //       if (to.meta.role.length === 0 || to.meta.role.includes(rr)) {
    //           if(to.query.type==='online'){
    //               store.commit('setType',to.query.type)
    //           }
    //               next(to.path)
    //       } else {
    //         next('/404')
    //       }
    //     })
    //   } else { //无参
        next('/login')
    //   }
    }
  } else {
    if (to.meta.role.length === 0 || to.meta.role.includes(role)) {
      next()
    } else {
      next('/404')
    }
  }
  NProgress.done()
})
