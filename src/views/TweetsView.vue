<template>
  <v-container fluid>
    <v-row dense align="center">
      <h2 class="uni-sans-heavy white--text mx-4">{{ lang.tweets }}</h2>
      <v-spacer/>
      <v-sheet color="transparent">
        <v-text-field
            v-model="search" clearable hide-details dense outlined
            dark rounded append-icon="mdi-magnify" :label="lang.search" @keydown.enter="refresh"
        />
      </v-sheet>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row justify="center" dense>
      <template v-for="(tweet, key) in tweets.items">
        <v-col cols="auto">
          <v-menu :key="key" transition="origin" rounded bottom right offset-x :close-on-content-click="false" z-index="1" absolute>
            <template v-slot:activator="{ on, attrs }">
              <v-card height="180px" width="180px" outlined dark rounded @click="openTweet" v-bind="attrs" v-on="on">
                <v-hover v-slot="{ hover }">
                  <v-img width="100%" height="100%" class="pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="tweet.images[0]">
                    <div class="full-width full-height d-flex">
                      <v-chip class="mt-auto ml-auto ma-1" small>1/{{ tweet.images.length + tweet.videos.length }}</v-chip>
                    </div>
                  </v-img>
                </v-hover>
              </v-card>
            </template>
            <v-list width="350" outlined flat color="dark-4" dark dense>
              <v-list-item-group>

                <v-list-item @click="openTweetSource(tweet)">
                  <v-list-item-icon class="mx-2 my-auto">
                    <v-icon>fab fa-twitter</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-15">Abrir tweet</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="openPostDialog(tweet)">
                  <v-list-item-icon class="mx-2 my-auto">
                    <v-icon>far fa-square-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-15">Añadir como un post</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
      </template>
    </v-row>

    <v-row dense align="center">
      <v-spacer/>
      <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import {Component, Mixins, Watch} from 'vue-property-decorator'
import {MultipleItem} from "@/handlers/interfaces/ContentUI"
import PaginationMixin from "@/mixins/PaginationMixin"
import TweetService from "@/service/TweetService"
import Tweet from "@/model/twitter/Tweet"
import Handler from "@/handlers/Handler"
import {getModule} from "vuex-module-decorators";
import LangModule from "@/store/LangModule";

@Component({})
export default class TweetsView extends Mixins(PaginationMixin) {

    loading: boolean = false
    size = 30
    tweets: MultipleItem<Tweet> = { items: [], totalItems: 0 }
    get lang() { return getModule(LangModule).lang }

    created() {
        this.refresh()
    }

    async refresh() {
        await Handler.getItems(this, this.tweets, () =>
          TweetService.findTweets(this.page - 1, this.size, this.search)
        )
        this.setPageCount(this.tweets.totalItems!)
    }

    openTweet(tweet: Tweet) {

    }

    openTweetSource(tweet: Tweet) {
        window.open(`https://twitter.com/${tweet.author!!.username}/status/${tweet.id}`, '_blank');
    }

    openPostDialog(tweet: Tweet) {
      //Todo: implement creating posts from here
    }

    @Watch("page")
    async onPageChanged() {
        await this.refresh()
        await this.$vuetify.goTo(0)
    }

}
</script>