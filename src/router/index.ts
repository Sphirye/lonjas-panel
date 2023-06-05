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
  {path: '/categories/:id', name: 'Category', component: () => import('../views/CategoryView.vue')},
  { path: '/characters', name: "Characters", component: () => import('../views/CharactersView.vue'), meta: { requiresAuth: true } },
  { path: '/characters/:id', name: "Character", component: () => import('../views/CharacterView.vue'), meta: { requiresAuth: true } },
  { path: '/posts', name: "Posts", component: () => import('../views/PostsView.vue'), meta: { requiresAuth: true } },
  { path: '/posts/:id', name: "Post", component: () => import('../views/PostView.vue'), meta: { requiresAuth: true } },
  { path: '/profiles', name: "Perfiles", component: () => import('../views/ProfilesView.vue'), meta: { requiresAuth: true } },
  { path: '/profiles/twitter/:id', name: "Perfil de Twitter", component: () => import('../views/profiles/TwitterProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profiles/twitter/:twitterUserId/tweet/:id', name: "Tweet", component: () => import('../views/TweetView.vue'), meta: { requiresAuth: true } },
  { path: '/users', name: "Users", component: () => import('../views/UsersView.vue'), meta: { requiresAuth: true } },
  { path: '/synchros', name: "Synchros", component: () => import('../views/SynchrosView.vue'), meta: { requiresAuth: true } },
  { path: '/tweets', name: "Tweets", component: () => import('../views/TweetsView.vue'), meta: { requiresAuth: true } },
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

  next()
})

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

export default router