<template>
  <v-app-bar color="dark-4" dark app clipped-left flat>
    <v-app-bar-nav-icon @click.stop="toggleDrawer"/>

    <div class="pointer" @click="$router.push('/').catch(err => {})">
      <span class="uni-sans-heavy text-35 grey--text text--lighten-1 mx-3">LONJAS</span>
    </div>

    <v-spacer/>

    <template v-if="isLogged">
      <v-menu bottom offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-avatar color="cyan darken-2 pointer" v-on="on" class="text-20">
            {{sessionModule.session.user.username[0]}}
          </v-avatar>
        </template>

        <template v-if="isLogged">
          <v-list min-width="200" color="dark-5" dark>
            <v-subheader>
              <div>{{ sessionModule.session.user.username }}</div>
            </v-subheader>

            <v-divider class="mx-3"/>

            <v-list-item @click="$router.push({path: '/profile'})" dense class="ma-1">
              <v-list-item-avatar class="mr-0 my-0 py-0">
                <v-icon dense>fas fa-circle-user</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-15">Perfil</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="logout" dense class="ma-1 red--text">
              <v-list-item-avatar class="mr-0 my-0 py-0">
                <v-icon color="red">fas fa-circle-left</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-15">Cerrar Sesión</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>
        </template>
      </v-menu>
    </template>

  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import DrawerModule from "@/store/DrawerModule";
import SessionModule from "@/store/SessionModule";
import LoginService from "@/service/LoginService";

@Component
export default class HeaderComponent extends Vue {
	lang = getModule(LangModule).lang
  drawerModule:DrawerModule = getModule(DrawerModule)
  sessionModule: SessionModule = getModule(SessionModule)

  get drawer() { return this.drawerModule.drawer }
  set drawer(value: boolean) { this.drawerModule.setDrawer(value) }

  get isLogged(): boolean { return LoginService.isLogged() }

  toggleDrawer(){ this.drawerModule.toggle() }

  async logout() {
    await LoginService.logout()
    await this.$router.push("/login")
    this.drawer = false
  }


}
</script>
