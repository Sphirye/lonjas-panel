<template>
  <v-navigation-drawer v-model="drawer" clipped app :mobile-breakpoint="0">
    <v-list class="my-0 py-0">
      <v-list-item-group>
        <template v-for="(button,index) in buttons">
          <v-list-item class="d-flex justify-start" :key="index" @click="$router.push(button.url).catch(err => {})">
            <span class="grey--text text--darken-2 underline-on-hover my-auto">{{ button.title.toUpperCase() }}</span>
          </v-list-item>
          <v-divider v-if="index < buttons.length - 1" :key="`${index}-divider`" class="grey lighten-2 mx-2"/>
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
    { title: this.lang.home, url: "/", id: 1 },
    { title: this.lang.about, url: "/about", id: 2 },
  ]
}
</script>

<style scoped>

</style>