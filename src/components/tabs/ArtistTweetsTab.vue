<template>
  <v-container>
    <v-row align="center">
      <v-progress-linear class="mt-4" color="grey" :indeterminate="loading"/>
      <v-col cols="3" v-for="(tweet, key) in tweets" :key="key">
        <v-card height="200px" max-height="250px" outlined dark rounded @click="$router.push(`/artists/${artist.id}/tweets/${tweet.id}`)">
          <v-hover v-slot="{ hover }">
            <v-img width="100%" height="100%" class="pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="tweet.images[0]">
              <v-expand-transition>
                <v-sheet tile color="rgba(44,48,59,0.84)" v-if="hover" class="d-flex flex-column transition-fast-in-fast-out" style="height: 100%">
                  <div class="px-3 pb-4 pt-2">
                    <p class="work-sans grey--text mt-2">"{{tweet.text}}"</p>
                  </div>
                </v-sheet>
              </v-expand-transition>
            </v-img>
          </v-hover>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import TweetService from "@/service/TweetService"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Tweet from "@/model/twitter/Tweet"
import Artist from "@/model/Artist"

@Component
export default class ArtistTweetsTab extends Vue {

  @Prop() readonly artist!: Artist
  get lang() { return getModule(LangModule).lang }

  loading: boolean = false
  tweets: Tweet[] = []
  page: number = 1
  size: number = 100
  search: string = ""

  created() {
    this.refresh()
  }

  refresh() {
    TweetService.findArtistTweets(this, this.tweets, this.page - 1, this.size, this.search, this.artist.id!)
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