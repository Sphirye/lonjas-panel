<template>
  <v-card width="100%" height="100%" dark color="lonjas-base-2">
    <v-card-title class="headline primary--text">
      <v-row class="py-1" align="center" no-gutters>
        <h5 class="mx-3 grey--text text--lighten-2 font-weight-bold">Crear post</h5>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="7">
              <v-text-field :rules="[rules.required]" type="number" v-model="tweetId" label="Id del Tweet" outlined rounded dense hide-details/>
            </v-col>
            <v-col cols="5">
              <v-autocomplete hide-details outlined class="rounded mb-1" dense label="Tags"/>
              <v-autocomplete hide-details outlined class="rounded my-1" dense label="Grupos"/>
              <v-autocomplete hide-details outlined class="rounded mt-1" dense label="Personajes"/>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">
        Cancelar
      </v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" @click="createPost">
        Continuar
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import {Component, Prop, PropSync, Ref, Vue} from "vue-property-decorator"
import TweetService from "@/service/TweetService"
import {getModule} from "vuex-module-decorators"
import PostService from "@/service/PostService"
import LangModule from "@/store/LangModule"
import Tweet from "@/model/twitter/Tweet"
import Artist from "@/model/Artist"
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";
import Rules from "@/service/tool/Rules";

@Component
export default class CreatePostDialog extends Vue {

  get lang() { return getModule(LangModule).lang }

  @Ref() readonly form!: HTMLFormElement
  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  loading: boolean = false
  tweetId: string = ""
  artist: Artist = new Artist()
  tweet: Tweet = new Tweet()

  get rules() { return Rules }

  created() {
    console.log(this.$route.params)
    this.refresh()
  }

  async refresh() {
    await TweetService.getTweet(this, this.$route.params.tweetId)
  }

  async createPost() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea crear un post a partir de este tweet?", async () => {
        await PostService.createPostFromTweet(this, this.$route.params.artistId, this.tweet.id!!)
        this.tweetId = ""
        this.artist = new Artist()
        this.tweet = new Tweet()
      }))
    }
  }

  close() {
    this.syncedDialog = false
  }
}
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>