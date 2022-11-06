import Vue from 'vue'
import VueRouter from 'vue-router'
import {lsget} from "@/plugins/localstorage";

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
    if (!lsget('auth', 'token')) {
        next()
        return
    }
    next('/')
}

const routes = [
    {
        path: '/auth',
        name: 'Авторизация',
        component: () => import('@/components/views/AuthView.vue'),
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/map',
        component: () => import('../components/map/MapView.vue'),
    },
    {
        path: '/table',
        component: () => import('../components/table/EventView.vue'),
    },

    {
        path: '/404',
        name: '404',
        component: ()=> import ('../components/views/404.vue'),
    },
    {
        path: '/',
        redirect:'/map'
    },
    {
        path: '/*',
        redirect: '/404'
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
