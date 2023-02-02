<template>
  <v-container fluid class="px-8">
    <template v-if="artist.id">

      <v-progress-linear class="mb-4" color="grey" :indeterminate="loading"/>
      <v-row no-gutters justify="start" align="start" dense>
        <v-col cols="4">
          <v-card flat class="lonjas-base-2" dark>
            <v-card-title class="mx-3">
              <v-avatar size="128" class="mr-4">
                <v-img contain :src="artist.twitter.profileImageUrl"/>
              </v-avatar>
              <div>
                <span class="text-20 font-weight-bold grey--text text--lighten-2">{{ artist.twitter.name }}</span>
                <br/>
                <span class="font-weight-medium grey--text">@{{ artist.twitter.username }}</span>
              </div>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
              <div>

                <p style="white-space: pre-wrap;" class="mx-4 font-weight-medium text-15">{{ artist.twitter.description }}</p>

                <v-divider class="my-3"/>
                <div class="mx-3">
                  <v-row align="center">
                    <v-col cols="10">
                      <h3 class="font-weight-medium">Posts: {{ totalPosts }}
                        <v-tooltip top max-width="150px">
                          <template v-slot:activator="{ on, attrs }">
                            <span v-on="on" v-bind="attrs" class="grey--text text--darken-1 pointer">?</span>
                          </template>
                          <span class="text-center">Cantidad total de posts añadidos a la galería.</span>
                        </v-tooltip>
                      </h3>
                      <h3 class="font-weight-medium">
                        Last update: 30 min ago.
                      </h3>
                    </v-col>
                    <v-col cols="2">
                      <v-icon size="30">fab fa-twitter</v-icon>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-row>

          </v-row>


          <template v-if="false">
            <v-row no-gutters align="center" dense>
              <v-tabs v-model="tab" centered background-color="transparent">
                <v-tab v-for="item in tabs" :key="item.route" active-class="grey darken-2 grey--text">
                  <span class="uni-sans-heavy grey--text text--lighten-2 text-20">{{ item.name }}</span>
                </v-tab>
              </v-tabs>
            </v-row>
            <v-tabs-items v-model="tab" class="transparent">

              <v-tab-item :value="0" :key="0">
                <ArtistPostsTab v-if="tab == 0" :artist="artist"/>
              </v-tab-item>

              <v-tab-item :value="1" :key="1">
                <ArtistTweetsTab v-if="tab == 1" :artist="artist"/>
              </v-tab-item>
            </v-tabs-items>
          </template>
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
import ArtistPostsTab from "@/components/tabs/ArtistPostsTab.vue";
import ArtistTweetsTab from "@/components/tabs/ArtistTweetsTab.vue";
import RouterTool from "@/service/tool/RouterTool";
import Tab from "@/model/vue/Tab";
import Handler from "@/handlers/Handler";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";

@Component( { components: { PostCardComponent, ArtistPostsTab, ArtistTweetsTab } } )
export default class PostsView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  tab = 0

  tabs: Tab[] = [
    { name: "Posts", route: "/posts"  },
    { name: "Tweets", route: "/tweets" }
  ]

  loading: boolean = false
  artist: Artist = new Artist()

  posts: MultipleItem<Post> = {
    items: [],
    totalItems: 0
  }

  post: Post = new Post()
  page: number = 1
  size: number = 10

  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }

  async created() {
    await ArtistService.getArtist(this, Number(this.$route.params.id))
    await this.refresh()
    this.tab = RouterTool.configTabs(this, this.tabs)
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.posts, () =>
          PostService.getPosts(this.page - 1, this.size, this.artist.id!!, null, null, null, null)
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
