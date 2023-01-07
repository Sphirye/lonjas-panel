<template>
  <v-app-bar color="lonjas-base-2" dark clipped-left clipped-right app flat style="border-bottom: 1px solid rgba(64,64,64,0.52) !important;">
    <v-app-bar-nav-icon @click.stop="toggleDrawer"/>

    <div class="pointer" @click="$router.push('/').catch(err => {})">
      <span class="uni-sans-heavy text-35 grey--text text--lighten-1 mx-3">LONJAS</span>
    </div>

    <v-spacer/>

    <div class="mx-2">
      <v-text-field :label="lang.search" dense append-icon="fas fa-search" outlined hide-details="auto" dark rounded/>
    </div>

  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import DrawerModule from "@/store/DrawerModule";

@Component
export default class HeaderComponent extends Vue {
	lang = getModule(LangModule).lang
  drawerModule:DrawerModule = getModule(DrawerModule)

  get drawer() { return this.drawerModule.drawer }
  set drawer(value: boolean) { this.drawerModule.setDrawer(value) }

  toggleDrawer(){ this.drawerModule.toggle() }


}
</script>
