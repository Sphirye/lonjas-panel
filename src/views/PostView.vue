<template>
  <v-container fluid>
    <v-row dense>

      <v-col cols="4" v-if="post.item.id">
        <ArtistCardComponent :artist="post.item.artist"/>
      </v-col>

      <v-col cols="8">
        <v-card outlined dark color="dark-4" v-if="post.item.id">
          <v-card-title class="pb-0">
            <span class="uni-sans-heavy text-md white--text mx-4">Post - {{ post.item.id }}</span>
            <v-spacer/>
            <v-switch readonly @click="setPostStatus" v-model="post.item.enabled" label="Activo" hide-details class="my-0 py-0" inset/>
            <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
          </v-card-title>

          <v-card-text class="py-0">

            <PostImageComponent :post="post.item"/>

          </v-card-text>

          <v-card-text class="py-0 my-2">
            <v-row align="center" dense>
              <v-col cols="4">
                <v-autocomplete
                    hide-details class="rounded" solo flat background-color="dark-1"
                    label="Tags" item-text="name" item-value="id" v-model="post.item.tags"
                    :items="tags.items" multiple deletable-chips small-chips :search-input.sync="tagSearch"
                    :rules="[rules.required]" return-object chips cache-items v-debounce:200="getTags"
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                    hide-details class="rounded my-3" :label="lang.categories" solo flat background-color="dark-1"
                    :items="categories.items" v-model="post.item.categories" item-value="id"
                    multiple chips deletable-chips small-chips item-text="name" dark :search-input.sync="categorySearch"
                    :rules="[rules.required]" return-object cache-items v-debounce:200="getCategories"
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                    hide-details solo flat class="rounded" label="Personajes" background-color="dark-1"
                    :items="characters.items" v-model="post.item.characters" item-value="id"
                    multiple chips deletable-chips item-text="name" dark :search-input.sync="characterSearch"
                    :rules="[rules.required]" return-object cache-items v-debounce:200="getCharacters"
                >
                  <template v-slot:item="{ item, on, attrs }">
                    <v-list-item dense v-on="on">
                      <v-list-item-action disabled class="mr-3">
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
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn color="red darken-3" depressed>
              <span class="font-weight-bold">{{ lang.delete }}</span>
            </v-btn>
            <v-spacer/>
            <v-btn color="green darken-2" depressed @click="updatePost">
              <span class="font-weight-bold">{{ lang.save }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
      <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue"
import {Component, Vue} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Dialog from "@/model/vue/Dialog"
import Tag from "@/model/Tag"
import PostService from "@/service/PostService";
import Post from "@/model/Post";
import Category from "@/model/Category";
import Character from "@/model/Character";
import Rules from "@/service/tool/Rules";
import CategoryService from "@/service/CategoryService";
import CharacterService from "@/service/CharacterService";
import ArtistService from "@/service/ArtistService";
import ArtistCardComponent from "@/components/ArtistCardComponent.vue";
import PostImageComponent from "@/components/PostImageComponent.vue";

@Component({
  components: {PostImageComponent, ArtistCardComponent}
})
export default class PostView extends Vue {

  get rules() { return Rules }
  get lang() { return getModule(LangModule).lang }

  loading: boolean = false
  totalItems: number = 0
  dialog: boolean =false
  post: SingleItem<Post> = { item: new Post() }

  tagSearch: string = ""
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }

  categorySearch: string = ""
  categories: MultipleItem<Category> = { items: [], totalItems: 0 }

  characterSearch: string = ""
  characters: MultipleItem<Character> = { items: [], totalItems: 0 }

  async created() {
    try {
      await Handler.getItem(this, this.post, () => PostService.getPost(Number(this.$route.params.id)))
      if (this.post.item.id) {
        this.characters.items.push(...this.post.item.characters!)
        this.categories.items.push(...this.post.item.categories!)
        this.tags.items.push(...this.post.item.tags!)
        await this.refresh()
      }
    } catch (e) { console.log(e) }
  }

  async refresh() {
    try {
      await this.getTags()
      await this.getCategories()
      await this.getCharacters()
    } catch (e) { console.log(e) }
  }

  async getCategories() {
    await Handler.getItems(this, this.categories, () => CategoryService.getPublicCategories(0, 10, this.categorySearch))
  }

  async getCharacters() {
    await Handler.getItems(this, this.characters, () => CharacterService.getCharacters(0, 10, this.characterSearch, null))
  }

  async getTags() {
    await Handler.getItems(this, this.tags, () => TagService.getTags(0, 10, this.tagSearch, null))
  }

  async updatePost() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea actualizar los datos del post?", async () => {
      try {
        await Handler.getItem(this, this.post, () => PostService.updatePost(Number(this.$route.params.id), this.post.item))
      } catch (e) { console.log(e) }
    }))
  }

  async setPostStatus() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", async () => {
      await Handler.getItem(this, this.post, () =>
          PostService.setPostStatus(this.post.item.id!, !this.post.item.enabled)
      )
    }))
  }
}
</script>