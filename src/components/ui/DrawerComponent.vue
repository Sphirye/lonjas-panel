<template>
  <v-navigation-drawer v-model="drawer" clipped app color="lonjas-base-2" width="210" :mobile-breakpoint="0">
    <v-list class="my-0 py-0">
      <template v-for="(button,index) in buttons">
        <v-list-item class="d-flex justify-start" :key="index" @click="$router.push(button.route).catch(err => {})">
          <v-list-item-action-text>
            <v-icon dark class="mr-3">{{button.icon}}</v-icon>
            <span class="grey--text my-auto text-sm font-weight-medium">{{ button.title.toUpperCase() }}</span>
          </v-list-item-action-text>
        </v-list-item>
        <v-divider v-if="index != buttons.length - 1" :key="`${index}-divider`" class="grey darken-3 mx-2"/>
      </template>
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
    { title: "Categorías", route: "/categories", icon: "fas fa-tags", id: 3 },
    { title: "Personajes", route: "/characters", icon: "fas fa-tags", id: 3 },
    { title: "Posts", route: "/posts", icon: "fas fa-tags", id: 3 },
  ]
}
</script>

<style scoped>

</style>