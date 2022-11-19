import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import {getModule} from "vuex-module-decorators"
import SessionModule from "@/store/SessionModule"
import LoginService from "@/service/LoginService";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue'), meta: { requiresAuth: false } },
]

const router = new VueRouter({
  mode: 'history', base: process.env.BASE_URL, routes
})


router.beforeEach(async(to, from, next) => {

  let sessionModule: SessionModule = getModule(SessionModule)

  if (sessionModule.session && sessionModule.session.token) {
    sessionModule.saveSession()
  }

  sessionModule.loadSession()

  if (to.path == "/login" && LoginService.isLogged()) {
    return next({ path: '/' })
  }

  if (to.meta?.requiresAuth) {
    if (!LoginService.isLogged()) {
      return next({ path:'/login' })
    }
  }

  next()
})

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

export default router