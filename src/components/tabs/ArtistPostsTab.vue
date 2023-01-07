<template>
  <v-container>

    <v-tabs v-model="tab" class="d-none">
      <v-tab v-for="(item, key) in tabs" :key="key"/>
    </v-tabs>

    <v-tabs-items v-model="tab" class="transparent">
      <v-progress-linear color="grey" :indeterminate="loading"/>

      <v-tab-item :value="0" :key="0">
        <v-row align="center" no-gutters class="mt-2 py-2">
          <v-spacer/>
          <v-sheet color="transparent">
            <v-text-field
                outlined dense dark hide-details rounded append-icon="fas fa-search"
                :label="lang.search" v-model="search" @keydown.enter="refresh"
            />
          </v-sheet>
        </v-row>

        <v-divider class="mb-2" dark/>

        <v-row align="center" dense>
          <v-col cols="3" v-for="(post, key) in posts.items" :key="key">
            <v-card height="200px" max-height="250px" outlined dark rounded @click="selectPost(post)">
              <v-hover v-slot="{ hover }">
                <v-img width="100%" height="100%" class="pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="post.tweet.images[0]">
                  <v-expand-transition>
                    <v-sheet tile color="rgba(44,48,59,0.84)" v-if="hover" class="d-flex flex-column transition-fast-in-fast-out" style="height: 100%">
                      <div class="px-3 pb-4 pt-2">
                        <p class="work-sans grey--text mt-2">"{{post.tweet.text}}"</p>
                      </div>
                    </v-sheet>
                  </v-expand-transition>
                </v-img>
              </v-hover>
            </v-card>
          </v-col>
        </v-row>

      </v-tab-item>

      <v-tab-item :value="1" :key="1">

        <div class="d-flex align-center my-1">
          <v-btn @click="tab = 0" icon dark>
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </div>

        <v-progress-linear class="mb-2" color="grey" :indeterminate="loading"/>

        <template v-if="tab == 1">
          <PostTab :post-id="post.id" v-if="post.id" @back="tab = 0"/>
        </template>
      </v-tab-item>
    </v-tabs-items>

  </v-container>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Artist from "@/model/Artist"
import PostService from "@/service/PostService"
import Post from "@/model/Post";
import Tab from "@/model/vue/Tab";
import PostTab from "@/components/tabs/PostTab.vue";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Handler from "@/handlers/Handler";

@Component( { components: { PostTab } } )
export default class ArtistPostsTab extends Vue {

  @Prop() readonly artist!: Artist
  get lang() { return getModule(LangModule).lang }

  search: string = ""

  loading: boolean = false
  tab: number = 0
  posts: MultipleItem<Post> = {
    items: [],
    totalItems: 0
  }

  post: Post = new Post()
  page: number = 1
  size: number = 10

  tabs: Tab[] = [
    { name: "Posts" },
    { name: "Post" }
  ]

  created() {
    this.refresh()
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

  selectPost(post: Post) {
    this.post = post
    this.tab = 1
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