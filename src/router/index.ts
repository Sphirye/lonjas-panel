import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import {getModule} from "vuex-module-decorators"
import SessionModule from "@/store/SessionModule"
import LoginService from "@/service/LoginService"

Vue.use(VueRouter)


const routes: Array<RouteConfig> = [
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue'), meta: { requiresAuth: false } },
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/artists', name: 'Artists', component: () => import('../views/ArtistsView.vue'), meta: { requiresAuth: true } },
  { path: '/artists/:id', name: 'Artist', component: () => import('../views/ArtistView.vue'), meta: { requiresAuth: true } },
  { path: '/artists/:id/tweets/:tweetId', name: 'Tweet', component: () => import('../views/TweetView.vue'), meta: { requiresAuth: true } },

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

  if (to.meta?.requiresAuth) {
    if (!LoginService.isLogged()) {
      return next({ path:'/login' })
    }
  }

  // if (to.path == "/login" && LoginService.isLogged()) {
  //   return next({ path: '/' })
  // }

  next()
})

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

export default router