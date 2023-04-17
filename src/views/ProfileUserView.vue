<template>
  <v-container fluid class="fill-height align-start justify-start">

    <v-row dense align="center" justify="start">
      <span class="uni-sans-heavy text-25 grey--text text--lighten-2 mx-4">Perfil de Usuario</span>
      <v-spacer/>
    </v-row>

    <v-progress-linear class="my-2" color="grey" :indeterminate="loading"/>

    <v-row align="start" justify="center" class="fill-height">

    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import SessionModule from "@/store/SessionModule";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import Post from "@/model/Post";
import Artist from "@/model/Artist";
import Handler from "@/handlers/Handler";
import PostService from "@/service/PostService";
import PostCardComponent from "@/components/PostCardComponent.vue";
import ArtistButtonComponent from "@/components/ArtistButtonComponent.vue";
import ArtistService from "@/service/ArtistService";
import User from "@/model/User";

@Component({components: {ArtistCardComponent: ArtistButtonComponent, PostCardComponent }})
export default class HomeView extends Vue {

  @Ref() readonly form!: HTMLFormElement
  sessionModule = getModule(SessionModule)
  loading: boolean = false
  user: SingleItem<Nullable<User>> = { item: null }
  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }

  created() {
    this.refresh()
  }

  async refresh() {

  }

}
</script>