<template>
  <v-container>
    <v-row align="center">
      XDD
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

  get lang() { return getModule(LangModule).lang }
  artist: Artist = new Artist()
  loading: boolean = false
  tweet: Tweet = new Tweet()

  created() {
    this.refresh()
  }

  async refresh() {
    await TweetService.getTweet(this, Number(this.$route.params.tweetId))
    // TweetService.findArtistTweets(this, this.tweets, this.page - 1, this.size, this.search, this.artist.id!)
  }


}
</script>
