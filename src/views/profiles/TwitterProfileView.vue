<template>
  <v-container fluid>
    <v-progress-linear :indeterminate="loading" class="mb-2" color="white"/>

    <template v-if="twitterUser.item.id">
      <v-row dense>
        <v-col cols="4">
          <v-card width="100%" flat class="dark-4" dark>
            <v-card-title class="mx-3">
              <v-avatar size="128" class="mr-4">
                <v-img contain :src="twitterUser.item.profileImageUrl"/>
              </v-avatar>
              <div>
                <span class="text-20 font-weight-bold grey--text text--lighten-2">{{ twitterUser.item.name }}</span> <br/>
                <span class="font-weight-medium grey--text">@{{ twitterUser.item.username }}</span>
              </div>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
              <div>

                <p style="white-space: pre-wrap;" class="mx-4 font-weight-medium text-15">{{ twitterUser.item.description }}</p>

                <v-divider class="my-3"/>

                <div class="mx-3">
                  <v-row align="center">
                    <v-col cols="10">
                      <h3 class="font-weight-medium">Tweets: {{ tweets.totalItems }}</h3>
                      <!--                    <h3 class="font-weight-medium">Last update: 30 min ago. </h3>-->
                    </v-col>
                    <v-col cols="2">
                      <v-icon size="30">fab fa-twitter</v-icon>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="d-flex flex-column justify-center align-center">
              <v-btn color="indigo mx-0 my-1" block @click="syncTweets">Sincronizar Tweets</v-btn>
              <v-btn color="indigo mx-0 my-1" block @click="storeMediaTweets">Almacenar archivos</v-btn>

              <template v-if="twitterUser.item.artist != undefined">
                <div class="full-width my-2">
                  <v-divider/>
                </div>
                <v-btn color="indigo mx-0 my-1" block @click="$router.push('/artists/' + twitterUser.item.artist.id)">Artista</v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-container fluid>
            <v-row dense>
              <v-spacer/>
              <v-sheet color="transparent">
                <v-text-field
                    clearable hide-details dense outlined dark append-icon="mdi-magnify" :label="lang.search"
                    v-model="search" @keydown.enter="clearAndRefresh"
                />
              </v-sheet>
            </v-row>

            <v-divider class="mt-4 mb-2" dark/>

            <v-row dense>
              <v-col cols="auto" class="flex-grow-1" v-for="(tweet, key) in tweets.items" :key="key">
                <v-menu transition="origin" rounded bottom right offset-x :close-on-content-click="false" z-index="1" absolute>
                  <template v-slot:activator="{ on, attrs }">
                    <v-card height="180px" width="180px" outlined dark rounded @click="selectedTweet = tweet" v-bind="attrs" v-on="on">
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
            </v-row>

            <v-divider class="my-4" dark/>

            <v-row dense justify="end" align="center">
              <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
            </v-row>
          </v-container>
        </v-col>
      </v-row>

      <v-dialog v-model="postDialog" width="800px" persistent>
        <CreatePostDialog :dialog.sync="postDialog" :tweet="selectedTweet"/>
      </v-dialog>
    </template>

  </v-container>
</template>

<script lang="ts">
import 'reflect-metadata'
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
import CreateTweetPostDialog from "@/components/dialog/CreateTweetPostDialog.vue";
import SnackbarModule from "@/store/SnackbarModule";

@Component({
    components: { CreatePostDialog: CreateTweetPostDialog }
})
export default class TwitterProfileView extends Vue {

    @Ref() readonly form!: HTMLFormElement

    get lang() { return getModule(LangModule).lang }
    get rules() { return Rules }

    postDialog: boolean = false
    selectedTweet: Nullable<Tweet> = null
    loading: boolean = false
    twitterUser: SingleItem<TwitterUser> = {item: new TwitterUser()}
    tweets: MultipleItem<Tweet> = {items: [], totalItems: 0}

    get isArtist() { return (this.twitterUser.item.artist != undefined) && (this.twitterUser.item.artist.id != undefined) }

    page: number = 1
    size: number = 40
    search: string = ""
    pageCount: number = 0

    async created() {
        try {
            await Handler.getItem(this, this.twitterUser, () => ProfilesService.getTwitterProfile(this.$route.params.id))
            if (this.twitterUser.item.id) { await this.refresh() }
        } catch (e) { console.log(e) }
    }

    async refresh() {
        try {
            await Handler.getItems(this, this.tweets, () =>
                TweetService.findTweetsByTwitterUser(this.page - 1, this.size, this.search, this.twitterUser.item!!.id!!)
            )
            this.pageCount = Math.ceil(this.tweets.totalItems! / this.size)
        } catch (e) {
            console.log(e)
        }
    }

    openPostDialog(tweet: Tweet) {
        if (this.isArtist) {
            this.selectedTweet = tweet
            this.postDialog = true
        } else {
          getModule(SnackbarModule).makeToast("Este perfil aún no esta adjunto a un artista.")
        }
    }

    async storeMediaTweets() { await TweetService.storeMediaTweets(this.twitterUser.item.id!!) }

    validate() {
        getModule(DialogModule).showDialog(new Dialog("Aviso", "¿Desea continuar?", () => {
            alert("Has continuado.")
        }))
    }

    async syncTweets() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea sincronizar los tweets de este usuario?", async () => {
            await TweetService.syncUserTweets(this, this.twitterUser.item.id!)
            await this.refresh()
        }))
    }

    openTweetSource(tweet: Tweet) {
        window.open(`https://twitter.com/${tweet.author!!.username}/status/${tweet.id}`, '_blank');
    }

    clearAndRefresh() {
        this.page = 1
        this.refresh()
    }

    @Watch('page')
    onPageChanged() { this.refresh() }

}
</script>