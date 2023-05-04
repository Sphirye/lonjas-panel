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

              <v-row no-gutters>
                <v-col cols="12" class="d-flex align-center">
                  <v-autocomplete
                      hide-details class="rounded" solo flat
                      :items="tags.items" multiple chips deletable-chips small-chips
                      label="Tags" item-text="name" item-value="id" v-model="selectedTags"
                      :rules="[rules.required]" v-debounce:200="getTags" :search-input.sync="tagSearch"
                      :loading="loading" cache-items
                  />

                  <v-btn icon class="ml-2" @click="tagDialog = true">
                    <v-icon large>far fa-square-plus</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="12" class="d-flex align-center">
                  <v-autocomplete
                      hide-details class="rounded my-3" label="Grupos" solo flat
                      :items="categories.items" v-model="selectedCategories" item-value="id"
                      multiple chips deletable-chips small-chips item-text="name" dark
                      :rules="[rules.required]" v-debounce:200="getCategories" :search-input.sync="categorySearch"
                      :loading="loading" cache-items
                  />

                  <v-btn icon class="ml-2" @click="categoryDialog = true">
                    <v-icon large>far fa-square-plus</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="12" class="d-flex align-center">
                  <v-autocomplete
                      hide-details solo flat class="rounded" :label="lang.characters"
                      :items="characters.items" v-model="selectedCharacters" item-value="id"
                      multiple chips deletable-chips small-chips item-text="name" dark
                      :rules="[rules.required]" v-debounce:200="getCharacters" :search-input.sync="characterSearch"
                      :loading="loading" cache-items
                  >
                    <template v-slot:item="{ item, on, attrs }">
                      <v-list-item dense v-on="on">
                        <v-list-item-action disabled class="mr-4">
                          <v-simple-checkbox v-model="attrs.inputValue"/>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            <h3 class="font-weight-medium">{{ item.name }}</h3>
                          </v-list-item-title>
                          <v-list-item-subtitle>{{ item.category.name }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-autocomplete>

                  <v-btn icon class="ml-2" @click="characterDialog = true">
                    <v-icon large>far fa-square-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
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

    <v-dialog v-model="tagDialog" width="600px">
      <CreateTagDialog  :dialog.sync="tagDialog" @created="this.refresh"/>
    </v-dialog>

    <v-dialog v-model="categoryDialog" width="600px">
      <CreateCategoryDialog :dialog.sync="categoryDialog" @created="this.refresh"/>
    </v-dialog>

    <v-dialog v-model="characterDialog" width="600px">
      <CreateCharacterDialog :dialog.sync="characterDialog" @created="this.refresh"/>
    </v-dialog>

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
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue";
import CreateCategoryDialog from "@/components/dialog/CreateCategoryDialog.vue";
import CreateCharacterDialog from "@/components/dialog/CreateCharacterDialog.vue";

@Component({
  components: {CreateCharacterDialog, CreateCategoryDialog, CreateTagDialog}
})
export default class CreateTweetPostDialog extends Vue {

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  @Prop() tweet!: Tweet
  get rules() { return Rules }
  get lang() { return getModule(LangModule).lang }

  loading: boolean = false

  tagSearch: string = ""
  tagDialog: boolean = false
  selectedTags: number[] = []
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }

  categorySearch: string = ""
  categoryDialog: boolean = false
  selectedCategories: number[] = []
  categories: MultipleItem<Category> = { items: [], totalItems: 0 }

  characterSearch: string = ""
  characterDialog: boolean = false
  selectedCharacters: number[] = []
  characters: MultipleItem<Character> = { items: [], totalItems: 0 }

  post: SingleItem<Post> = { item: new Post() }

  created() {
    this.refresh()
  }

  refresh() {
    this.getTags()
    this.getCharacters()
    this.getCategories()
  }

  async getTags() {
    await Handler.getItems(this, this.tags, () => TagService.getTags(0, 5, this.tagSearch, null))
  }

  async getCharacters() {
    await Handler.getItems(this, this.characters, () => CharacterService.getCharacters(0, 5, this.characterSearch, null))
  }

  async getCategories() {
    await Handler.getItems(this, this.categories, () => CategoryService.getPublicCategories(0, 5, this.categorySearch))
  }

  async createPost() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea crear un post a partir de este tweet?", async () => {
        try {
          await Handler.getItem(this, this.post, () =>
              PostService.createPostFromTweet(this.tweet.id!!, this.selectedTags, this.selectedCategories, this.selectedCharacters)
          )
          this.close()
        } catch (e) { console.log(e) }
      }))
    }
  }

  close() {
    this.syncedDialog = false
    this.selectedTags = []
    this.selectedCategories = []
    this.selectedCharacters = []
    this.refresh()
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