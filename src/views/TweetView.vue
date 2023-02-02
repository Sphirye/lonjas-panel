<template>
  <v-container fluid>
    <v-progress-linear :indeterminate="loading" class="mb-2" color="white"/>
    <v-row dense v-if="tweet.item.id">
      <v-col cols="4">
        <v-card width="100%" flat class="dark-4" dark>
          <v-card-title class="mx-3">
            <v-avatar size="128" class="mr-4">
              <v-img contain :src="tweet.item.author.profileImageUrl"/>
            </v-avatar>
            <div>
              <span class="text-20 font-weight-bold grey--text text--lighten-2">{{ tweet.item.author.name }}</span>
              <br/>
              <span class="font-weight-medium grey--text">@{{ tweet.item.author.username }}</span>
            </div>
          </v-card-title>
          <v-divider class="mx-3"/>
          <v-card-text>
            <div>

              <p style="white-space: pre-wrap;" class="mx-4 font-weight-medium text-15">{{ tweet.item.author.description }}</p>

              <v-divider class="my-3"/>

              <div class="mx-3">
                <v-row align="center">
                  <v-col cols="10">
                    <h3 class="font-weight-medium">
                      XDD
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
        <v-card dark flat color="dark-4" class="px-2 py-2 my-2">
          <v-row no-gutters style="flex-wrap: nowrap;">
            <v-col cols="auto" class="d-flex justify-center flex-grow-0 flex-shrink-0">
              <div color="transparent" class="pa-2">
                <v-avatar>
                  <v-img :src="tweet.item.author.profileImageUrl"/>
                </v-avatar>
              </div>
            </v-col>
            <v-col cols="11" style="min-width: 100px;" class="flex-grow-0 flex-shrink-">
              <div color="transparent">
                <div class="d-flex align-center">
                  <h3 class="font-weight-bold">{{ tweet.item.author.name }}</h3>
                  <h4 class="font-weight-light grey--text text--lighten-2 mx-1">@{{ tweet.item.author.username }}</h4>
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
                        <v-list-item>
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
                  <h4 class="font-weight-regular">{{ tweet.item.description }}</h4>
                </div>
                <v-row justify="start">
                  <v-col cols="auto">
                    <v-sheet dark outlined class="rounded">
                      <v-carousel show-arrows>
                        <template v-for="(image, key) in tweet.item.images">
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
      </v-col>

    </v-row>

  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from 'vue-property-decorator'
import Rules from "@/service/tool/Rules"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import Dialog from "@/model/vue/Dialog"
import Handler from "@/handlers/Handler";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import TwitterUser from "@/model/twitter/TwitterUser";
import TwitterUserService from "@/service/TwitterUserService";
import ProfilesService from "@/service/ProfilesService";
import TweetService from "@/service/TweetService";
import LangModule from "@/store/LangModule";
import Tweet from "@/model/twitter/Tweet";

@Component
export default class TwitterProfileView extends Vue {

  @Ref() readonly form!: HTMLFormElement
  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }

  loading: boolean = false
  twitterUser: SingleItem<TwitterUser> = { item: new TwitterUser() }
  tweets: MultipleItem<Tweet> = { items: [], totalItems: 0 }
  tweet: SingleItem<Tweet> = { item: new Tweet() }

  page: number = 1
  size: number = 40
  pageCount: number = 0

  async created() {
    await this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItem(this, this.tweet, () => TweetService.getTweet2(this.$route.params.id))
    } catch (e) { console.log(e) }
  }

  validate() {
    getModule(DialogModule).showDialog(new Dialog("Aviso", "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }
}
</script>
