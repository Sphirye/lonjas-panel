<template>
  <v-navigation-drawer v-model="drawer" clipped app color="dark-3" width="210" :mobile-breakpoint="0">

    <v-list dark class="my-0 py-0" dense>
      <v-list-item-group class="pa-2" mandatory>
        <template v-for="(item, key) in drawerList">
          <template v-if="item.subheader != null">
            <v-divider class="grey mx-1 mt-1 mb-2"/>
            <v-subheader class="text-uppercase" style="height: 30px">{{item.subheader}}</v-subheader>
          </template>
          <v-list-item v-else dense class="pl-3 mb-1" style="padding: 0px 10px !important;" @click="$router.push(item.to).catch(() => {})">
            <v-list-item-content>
              <v-list-item-title class="text-20 mx-0 grey--text text--lighten-1">{{ item.title }}</v-list-item-title>
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
import SessionModule from "@/store/SessionModule";
import Authority, {AuthorityName} from "@/model/Authority";
import drawerList from "@/service/tool/DrawerList";

@Component({ components: { } })
export default class DrawerComponent extends Vue {

  sessionModule: SessionModule = getModule(SessionModule)
  drawerModule:DrawerModule = getModule(DrawerModule)
  lang = getModule(LangModule).lang

  get drawer() { return this.drawerModule.drawer }
  set drawer(value: boolean) { this.drawerModule.setDrawer(value) }
  get drawerList() { return drawerList }

  created() {
    this.validatedDrawer(this.sessionModule.session.authorities)
  }

  validatedDrawer(authorities: Authority[]) {
    let list = []
    this.drawerList.forEach(item => {
      if (item.global) { list.push(item); }
      else {
        if (authorities.some(authority => item.allowed?.includes(authority.name!!))) { list.push(item) }
      }
    })
  }
}
</script>

<style>
.v-navigation-drawer__border {
  display: none !important;
}
</style>