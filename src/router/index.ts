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
  { path: '/artists/:id(\\d+)(/posts)?(/tweets)?', name: 'Artist', component: () => import('../views/ArtistView.vue'), meta: { requiresAuth: true } },
  { path: '/tags', name: "Tags", component: () => import('../views/TagsView.vue'), meta: { requiresAuth: true } },
  { path: '/tags/:id', name: "Tag", component: () => import('../views/TagView.vue'), meta: { requiresAuth: true } },
  { path: '/categories', name: "Categories", component: () => import('../views/CategoriesView.vue'), meta: { requiresAuth: true } },
  { path: '/characters', name: "Characters", component: () => import('../views/CharactersView.vue'), meta: { requiresAuth: true } },
  { path: '/posts', name: "Posts", component: () => import('../views/PostsView.vue'), meta: { requiresAuth: true } },
  { path: '/profiles', name: "Perfiles", component: () => import('../views/ProfilesView.vue'), meta: { requiresAuth: true } },
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