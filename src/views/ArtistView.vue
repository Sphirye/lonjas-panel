<template>
  <v-container fluid class="px-8">

    <v-progress-linear class="mb-4" color="grey" :indeterminate="loading"/>

    <template v-if="artist.item.id">
      <v-row justify="start" align="start" dense>
        <v-col cols="4">
          <ArtistCardComponent :artist="artist.item">
          </ArtistCardComponent>

          <v-divider class="my-2" dark/>

          <v-card flat dark>
            <v-card-actions class="px-2">
              <v-spacer/>
              <v-switch
                  class="my-0" label="Activo" inset dark dense hide-details="auto" v-model="artist.item.enabled" @click="setArtistStatus"
                  readonly
              />
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-row no-gutters>
            <v-sheet color="transparent" min-height="550px">
              <v-row dense>
                <template v-for="(post) in posts.items">
                  <v-col cols="auto">
                    <PostCardComponent width="150px" height="150px" :post="post"/>
                  </v-col>
                </template>
              </v-row>
            </v-sheet>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">

import PostCardComponent from "@/components/PostCardComponent.vue"
import {Component, Ref, Vue, Watch} from 'vue-property-decorator'
import ArtistService from "@/service/ArtistService"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import Artist from "@/model/Artist"
import Post from "@/model/Post";
import PostService from "@/service/PostService";
import ArtistPostsTab from "@/components/tabs/ArtistPostsTab.vue"
import RouterTool from "@/service/tool/RouterTool"
import Tab from "@/model/vue/Tab"
import Handler from "@/handlers/Handler";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import ArtistCardComponent from "@/components/ArtistCardComponent.vue";

@Component( { components: {ArtistCardComponent, PostCardComponent, ArtistPostsTab } } )
export default class PostsView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  tab = 0

  tabs: Tab[] = [
    { name: "Twitter", route: "/twitter"  },
  ]

  artist: SingleItem<Artist> = { item: new Artist() }

  loading: boolean = false

  posts: MultipleItem<Post> = {
    items: [],
    totalItems: 0
  }

  post: Post = new Post()
  page: number = 1
  size: number = 10

  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }
  get artistId() { return Number(this.$route.params.id) }


  async created() {
    try {
      if (this.$route.params.id == undefined) {
        await this.$router.push("/")
      }
      await Handler.getItem(this, this.artist, () =>
          ArtistService.getArtist(Number(this.$route.params.id))
      )
      await this.refresh()
      this.tab = RouterTool.configTabs(this, this.tabs)
    } catch (e) { console.log(e) }
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.posts, () =>
          PostService.getPosts(this.page - 1, this.size, this.artistId, null, null, null, null)
      )
    } catch (e) {
      console.log(e)
    }
  }

  validate() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }

  setArtistStatus() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", async () => {
      await Handler.getItem(this, this.artist, () =>
        ArtistService.setArtistStatus(this.artistId, !this.artist.item.enabled)
      )
    }))
  }

  @Watch("tab")
  watchTab() {
    RouterTool.watchTabs(this, "/artists/" + this.$route.params.id, this.tab, this.tabs)
  }

}
</script>

<style>
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
