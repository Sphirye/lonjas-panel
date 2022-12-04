<template>
  <v-container>
    <v-tabs v-model="tab" class="d-none">
      <v-tab v-for="(item, key) in tabs" :key="item.key"/>
    </v-tabs>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item :value="0" :key="0">
        <v-row align="center" dense>
          <v-progress-linear class="mt-4" color="grey" :indeterminate="loading"/>
          <v-col cols="3" v-for="(tweet, key) in tweets" :key="key">
            <v-card height="200px" max-height="250px" outlined dark rounded @click="selectTweet(tweet)">
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
      </v-tab-item>

      <v-tab-item :value="1" :key="1">
        <template v-if="tab == 1">
          <TweetTab @back="back()" :tweet-id="tweet.id" v-if="tweet.id"/>
        </template>
      </v-tab-item>
    </v-tabs-items>


  </v-container>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import TweetService from "@/service/TweetService"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Tweet from "@/model/twitter/Tweet"
import Artist from "@/model/Artist"
import Tab from "@/model/vue/Tab";
import TweetTab from "@/components/tabs/TweetTab.vue";

@Component({ components: { TweetTab } })
export default class ArtistTweetsTab extends Vue {

  @Prop() readonly artist!: Artist
  get lang() { return getModule(LangModule).lang }

  loading: boolean = false
  tweets: Tweet[] = []
  page: number = 1
  size: number = 16
  search: string = ""
  tab: number = 0
  tweet: Tweet = new Tweet()

  tabs: Tab[] = [
    { name: "Tweets" },
    { name: "Tweet" }
  ]

  created() {
    this.refresh()
  }

  refresh() {
    TweetService.findArtistTweets(this, this.tweets, this.page - 1, this.size, this.search, this.artist.id!)
  }

  back() {
    this.tweet = new Tweet()
    this.tab = 0
  }

  selectTweet(tweet: Tweet) {
    this.tweet = tweet
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