import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/home'
import Login from '../components/common/loginFinal'
import notFound from '../components/common/404'
import { routerConfig } from './router'


Vue.use(Router)
const routes = [
    // {
    //     path:'*',
    //     redirect:'/adminOnline'
    // },
    {
        path:'/',
        redirect: '/login'
    },
    {
        path:'/login',
        meta:{role:[]},
        component:Login,
    },
    {
        path:'/dashboard',
        component:Home,
        meta:{role:[]},
        children: routerConfig
    },
    {
        path: '/404',
        name:'404',
        meta:{role:[]},
        component:notFound
      },
    { path: '*', redirect: '/404' }
]   
const router = new Router({
    routes
})



export default router;
