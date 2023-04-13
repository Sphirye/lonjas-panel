<template>
  <v-card width="100%" height="100%" dark color="dark-2">
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
          <v-row dense align="center">
            <v-col cols="7">
              <v-text-field disabled type="number" v-model="tweet.id" label="Id del Tweet" outlined rounded dense hide-details/>
              <v-card class="mx-auto my-3" flat width="300px" height="300px">
                <v-img :src="tweet.images[0]" width="300px" height="300px" class="rounded portrait"/>
              </v-card>
            </v-col>
            <v-col cols="5">
              <v-autocomplete
                  hide-details class="rounded" solo flat background-color="dark-1"
                  :items="tags.items" multiple chips deletable-chips small-chips
                  label="Tags" item-text="name" item-value="id" v-model="selectedTags"
                  :rules="[rules.required]"
              />

              <v-autocomplete
                  hide-details class="rounded my-3" label="Grupos" solo flat background-color="dark-1"
                  :items="categories.items" v-model="selectedCategories" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name" dark
                  :rules="[rules.required]"
              />

              <v-autocomplete
                  hide-details solo flat class="rounded" label="Personajes" background-color="dark-1"
                  :items="characters.items" v-model="selectedCharacters" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name" dark
                  :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-progress-linear color="grey" :indeterminate="loading"/>
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
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import Tag from "@/model/Tag";
import Category from "@/model/Category";
import Character from "@/model/Character";
import Handler from "@/handlers/Handler";
import CategoryService from "@/service/CategoryService";
import TagService from "@/service/TagService";
import CharacterService from "@/service/CharacterService";
import Post from "@/model/Post";

@Component
export default class CreateTweetPostDialog extends Vue {

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  @Prop() tweet!: Tweet
  get rules() { return Rules }
  get lang() { return getModule(LangModule).lang }

  loading: boolean = false
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }
  selectedTags: number[] = []
  categories: MultipleItem<Category> = { items: [], totalItems: 0 }
  selectedCategories: number[] = []
  characters: MultipleItem<Character> = { items: [], totalItems: 0 }
  selectedCharacters: number[] = []

  post: SingleItem<Post> = { item: new Post() }

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.categories, () => CategoryService.getPublicCategories(0, 5, null))
      await Handler.getItems(this, this.tags, () => TagService.getTags(0, 5, null, null))
      await Handler.getItems(this, this.characters, () => CharacterService.getCharacters(0, 5, null, null))
    } catch (e) { console.log(e) }
  }

  async createPost() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea crear un post a partir de este tweet?", async () => {
        try {
          await Handler.getItem(this, this.post, () =>
              PostService.createPostFromTweet(this.tweet.id!!, this.selectedTags, this.selectedCategories, this.selectedCharacters)
          )
          this.syncedDialog = false
        } catch (e) { console.log(e) }
      }))
    }
  }

  close() {
    this.syncedDialog = false
  }

  clear() {
    this.tweet = new Tweet()
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

.portrait.v-card {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}
</style>