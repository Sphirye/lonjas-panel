<template>
  <v-row no-gutters dense>
  </v-row>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Artist from "@/model/Artist"
import PostService from "@/service/PostService"
import Post from "@/model/Post";

@Component
export default class ArtistPostsTab extends Vue {

  @Prop() readonly artist!: Artist
  get lang() { return getModule(LangModule).lang }

  posts: Post[] = []
  page: number = 1
  size: number = 10

  created() {
    this.refresh()
  }

  async refresh() {
    // await PostService.getPostsByArtist(this, this.artist.id!, this.posts, this.page - 1, this.size)
  }

}
</script>

<style>
.pre-blur-image .v-image__image{
  image-rendering: crisp-edges !important;
  transition: all 0.5s;
}

.blur-image .v-image__image {
  filter: blur(2px);
  -webkit-filter: blur(2px);
}
</style>