<template>
  <v-navigation-drawer v-model="drawer" clipped app color="dark-3" width="210" :mobile-breakpoint="0">
    <v-list class="my-0 py-0" dark>
      <v-list-item-group dark class="pa-2" mandatory>
        <template v-for="(button,index) in buttons">

          <v-list-item dense selectable class="pl-3 mb-1" :key="index" @click="$router.push(button.route).catch(err => {})">
            <v-list-item-content class="mx-0">
              <v-list-item-title class="text-20 mx-0 grey--text text--lighten-1">{{ button.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </template>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import DrawerModule from "@/store/DrawerModule"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"

@Component({ components: { } })
export default class DrawerComponent extends Vue {

  drawerModule:DrawerModule = getModule(DrawerModule)
  lang = getModule(LangModule).lang

  get drawer() { return this.drawerModule.drawer }
  set drawer(value: boolean) { this.drawerModule.setDrawer(value) }

  buttons = [
    { title: this.lang.home, route: "/", icon: "fas fa-house-user", id: 1 },
    { title: "Artistas", route: "/artists", icon: "fas fa-paint-brush", id: 2 },
    { title: "Tags", route: "/tags", icon: "fas fa-tags", id: 3 },
    { title: "Categorías", route: "/categories", icon: "fas fa-tags", id: 4 },
    { title: "Personajes", route: "/characters", icon: "fas fa-tags", id: 5 },
    { title: "Posts", route: "/posts", icon: "fas fa-tags", id: 6 },
    { title: "Perfiles", route: "/profiles", icon: "fas fa-tags", id: 7 },

  ]
}
</script>

<style>
.v-navigation-drawer__border {
  display: none !important;
}
</style>