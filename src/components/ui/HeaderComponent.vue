<template>
	<v-app-bar color="primary" dark clipped-left app flat>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
		<div class="d-flex align-center pointer" @click="$router.push('/').catch(err => {})">
			<v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40"/>
			<v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100"/>
		</div>
		<v-spacer/>
		<v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
			<span class="mr-2">Latest Release</span>
			<v-icon>mdi-open-in-new</v-icon>
		</v-btn>
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
}
</script>
