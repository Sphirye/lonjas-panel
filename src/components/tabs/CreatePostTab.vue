<template>
  <v-card dark color="lonjas-base-2">
    <v-card-title class="headline primary--text">
      <v-row class="py-1" align="center" no-gutters>
        <h5 class="mx-3 grey--text text--lighten-2 font-weight-bold">Crear post</h5>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-container fluid class="px-0 mx-0">
        <v-form ref="form">
          <v-row dense>
            <v-col cols="7">
              <v-text-field :rules="[rules.required]" type="number" v-model="tweetId" disabled label="Id del Tweet" outlined rounded dense hide-details/>
            </v-col>
            <v-col cols="5">

              <v-autocomplete
                  hide-details outlined class="rounded mb-1" dense
                  :items="tags" multiple chips deletable-chips small-chips
                  label="Tags" item-text="name" item-value="id" v-model="selectedTags"
              />

              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Grupos"
                  :items="categories" v-model="selectedCategories" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name"
              />

              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Personajes"
                  :items="characters" v-model="selectedCharacters" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="$emit('back')">
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
import TagService from "@/service/TagService";
import Tag from "@/model/Tag";
import Category from "@/model/Category";
import CategoryService from "@/service/CategoryService";
import Character from "@/model/Character";
import CharacterService from "@/service/CharacterService";

@Component
export default class CreatePostTab extends Vue {

  get lang() { return getModule(LangModule).lang }

  @Prop({ default: '' }) readonly tweetId!: string
  @Ref() readonly form!: HTMLFormElement
  loading: boolean = false
  artist: Artist = new Artist()
  tweet: Tweet = new Tweet()

  tags: Tag[] = []
  selectedTags: number[] = []

  categories: Category[] = []
  selectedCategories: number[] = []

  characters: Character[] = []
  selectedCharacters: number[] = []

  get rules() { return Rules }

  async created() {
    await TweetService.getTweet(this, this.tweetId)
    await this.refresh()
  }

  async refresh() {
    await TagService.getTags(this, this.tags, 0, 5,null, null)
    await CategoryService.getCategories(this, this.categories, 0, 5, null)
    await CharacterService.getCharacters(this, this.characters, 0, 5, null)
  }

  async createPost() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea crear un post a partir de este tweet?", async () => {
        await PostService.createPostFromTweet(
            this, this.$route.params.id, this.tweet.id!!, this.selectedTags, this.selectedCategories, this.selectedCharacters
        )
      }))
    }
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