<template>
  <v-container fluid class="px-8">
    <template v-if="artist.id">
      <v-row dense align="center">
        <span class="uni-sans-heavy text-md white--text mx-4">{{ lang.artist }}</span>
      </v-row>

      <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
      <v-row justify="start" align="start" dense>
        <v-col cols="4">
          <v-card flat class="lonjas-base-2" dark>
            <v-card-title>
              <v-avatar size="128">
                <v-img contain :src="artist.twitter.profileImageUrl"/>
              </v-avatar>
              <div class="ml-6">
                <h3 class="mb-0">{{ artist.twitter.name }}</h3>
                <p class="font-weight-regular grey--text">@{{ artist.twitter.username }}</p>
              </div>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
              <div class="px-3">

                <h3 class="mb-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu lorem quis arcu venenatis pharetra ac at tortor.</h3>

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
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-row dense align="center">
            <span class="uni-sans-heavy text-md white--text mx-4">{{ lang.posts }}</span>
          </v-row>
          <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
          <v-row no-gutters dense>
            <v-col cols="4" v-for="(post, key) in posts" :key="key">
              <v-card class="ma-1" outlined dark rounded height="250px">
                <v-img class="rounded-b" height="250px" :src="post.images[0]"/>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">

import PostCardComponent from "@/components/PostCardComponent.vue"
import {Component, Ref, Vue} from 'vue-property-decorator'
import ArtistService from "@/service/ArtistService"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import Artist from "@/model/Artist"
import Post from "@/model/Post";
import PostService from "@/service/PostService";

@Component( { components: { PostCardComponent } } )
export default class PostsView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  loading: boolean = false
  artist: Artist = new Artist()
  posts: Post[] = []
  page: number = 1
  size: number = 10

  totalPosts: number = 0

  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }

  created() {
    this.refresh()
  }

  async refresh() {
    await ArtistService.getArtist(this, Number(this.$route.params.id))
    await this.getPosts()
  }

  async getPosts() {
    await PostService.getPostsByArtist(this, this.artist.id!, this.posts, this.page - 1, this.size)
  }

  validate() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }

}
</script>

<style>
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
