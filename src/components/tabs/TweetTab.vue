<template>
  <v-container fluid class="px-0 pt-0">
    <v-tabs class="d-none" v-model="tab">
      <v-tab v-for="(item, key) in tabs" :key="key"/>
    </v-tabs>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item>
        <v-row no-gutters class="my-1">
          <v-btn @click="$emit('back')" icon dark>
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-row>
        <v-progress-linear color="grey" :indeterminate="loading"/>

        <template v-if="tweet.id">
          <v-card dark color="lonjas-base-2" class="px-2 py-2 my-2">
            <v-row no-gutters style="flex-wrap: nowrap;">
              <v-col cols="auto" class="d-flex justify-center flex-grow-0 flex-shrink-0">
                <div color="transparent" class="pa-2">
                  <v-avatar>
                    <v-img :src="tweet.author.profileImageUrl"/>
                  </v-avatar>
                </div>
              </v-col>
              <v-col cols="11" style="min-width: 100px;" class="flex-grow-0 flex-shrink-">
                <div color="transparent">
                  <div class="d-flex align-center">
                    <h3 class="font-weight-bold">{{ tweet.author.name }}</h3>
                    <h4 class="font-weight-light grey--text text--lighten-2 mx-1">@{{ tweet.author.username }}</h4>
                    <v-spacer/>
                    <v-menu transition="slide-x-transition" rounded bottom left offset-y :close-on-click="false">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                          <v-icon dense>fas fa-ellipsis</v-icon>
                        </v-btn>
                      </template>
                      <v-list width="350" outlined flat color="#5D6162" dark>
                        <v-subheader class="text-sm">{{ lang.options }}</v-subheader>
                        <div class="px-3"><v-divider/></div>
                        <v-list-item-group class="my-2">
                          <v-list-item @click="tab = 1">
                            <v-list-item-icon class="mx-2 my-auto">
                              <v-icon>far fa-square-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Añadir como un post</v-list-item-title>
                              <v-list-item-subtitle>Crea un post a partir de este tweet.</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mx-3"/>
                          <v-list-item>
                            <v-list-item-icon class="mx-2 my-auto">
                              <v-icon>fas fa-trash</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Eliminar tweet</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>

                      </v-list>
                    </v-menu>
                  </div>
                  <div class="mb-2">
                    <h4 class="font-weight-regular">{{ tweet.text }}</h4>
                  </div>
                  <v-row justify="start">
                    <v-col cols="auto">
                      <v-sheet dark outlined class="rounded">
                        <v-carousel show-arrows>
                          <template v-for="(image, key) in tweet.images">
                            <v-carousel-item :src="image" :key="key" contain/>
                          </template>
                        </v-carousel>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-tab-item>

      <v-tab-item>
        <v-row no-gutters>
          <v-btn @click="tab = 0" icon dark>
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-row>
        <v-progress-linear class="my-2" color="grey" :indeterminate="loading"/>

        <template v-if="tab == 1">
          <CreatePostTab @back="tab = 0" :tweet-id="tweet.id"/>
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
import Tweet from "@/model/twitter/Tweet";
import TweetService from "@/service/TweetService";
import CreatePostDialog from "@/components/dialog/CreatePostDialog.vue";
import Tab from "@/model/vue/Tab";
import CreatePostTab from "@/components/tabs/CreatePostTab.vue";

@Component( { components: { CreatePostDialog, CreatePostTab } } )
export default class TweetTab extends Vue {

  get lang() { return getModule(LangModule).lang }

  @Prop() readonly tweetId!: string
  loading: boolean = false
  dialog: boolean = false
  tweet: Tweet = new Tweet()

  tab: number = 0

  tabs: Tab[] = [
    { name: "Tweet" },
    { name: "Create Post" }
  ]

  created() {
    this.refresh()
  }

  async refresh() {
    await TweetService.getTweet(this, this.tweetId)
  }

  back() {
    this.$emit('back')
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