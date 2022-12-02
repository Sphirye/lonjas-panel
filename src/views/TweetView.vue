<template>
  <v-container fluid class="px-8">
    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <template v-if="tweet.id">
      <v-row align="start">
        <v-col cols="4">
          <v-card flat class="lonjas-base-2" dark>
            <v-card-title>
              <v-avatar size="128">
                <v-img contain :src="tweet.author.profileImageUrl"/>
              </v-avatar>
              <div class="ml-6">
                <h3 class="mb-0">{{ tweet.author.name }}</h3>
                <p class="font-weight-regular grey--text">@{{ tweet.author.username }}</p>
              </div>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
              <div>
                <h3 style="white-space: pre-wrap;" class="mx-4">{{ tweet.author.description }}</h3>
                <v-divider class="my-3"/>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-card outlined class="lonjas-base-2" dark>
            <v-card-text>
              <v-row dense no-gutters>
                <v-col cols="1" class="d-flex justify-center">
                  <v-avatar>
                    <v-img :src="tweet.author.profileImageUrl"/>
                  </v-avatar>
                </v-col>
                <v-col cols="11">
                  <div class="d-flex align-center">
                    <h2 class="font-weight-bold">{{ tweet.author.name }}</h2>
                    <h3 class="font-weight-light grey--text text--lighten-2 mx-1">@{{ tweet.author.username }}</h3>
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
                          <v-list-item @click="createPostDialog = true">
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
                    <h3 class="font-weight-regular">{{ tweet.text }}</h3>
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
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-dialog v-model="createPostDialog" width="750px">
      <CreatePostDialog :dialog.sync="createPostDialog"/>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import TweetService from "@/service/TweetService"
import {getModule} from "vuex-module-decorators"
import PostService from "@/service/PostService"
import LangModule from "@/store/LangModule"
import Tweet from "@/model/twitter/Tweet"
import Artist from "@/model/Artist"
import CreatePostDialog from "@/components/dialog/CreatePostDialog.vue";

@Component( {components: { CreatePostDialog }})
export default class ArtistTweetsTab extends Vue {

  get lang() { return getModule(LangModule).lang }
  loading: boolean = false
  artist: Artist = new Artist()
  tweet: Tweet = new Tweet()

  createPostDialog: boolean = false

  created() {
    this.refresh()
  }

  async refresh() {
    await TweetService.getTweet(this, this.$route.params.tweetId)
  }
}
</script>