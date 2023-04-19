<template>
  <v-container fluid>
    <template v-if="category.item.id">
      <v-row dense align="center">
        <h2 class="uni-sans-heavy white--text mx-4">{{ lang.category }}</h2>
      </v-row>

      <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

      <v-row dense>
        <v-col cols="4">

          <v-card outlined color="dark-3" dark>
            <v-card-title class="uni-sans-heavy">
              {{ lang.category }}
            </v-card-title>
            <v-divider/>

            <v-card-text>

              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="category.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
                </v-col>
              </v-row>

            </v-card-text>

            <v-card-actions>
              <v-spacer/>
              <v-btn color="green" depressed tile @click="updateCategory">
                <span class="font-weight-bold">{{ lang.save }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-divider class="my-2" dark/>

          <v-card outlined color="dark-3" dark>
            <v-card-title class="uni-sans-heavy">
              {{ lang.characters }}
            </v-card-title>
            <v-divider/>
            <v-card-text class="pt-1">
              <v-list dense color="transparent" dark>
                <template v-for="(character) in characters.items">
                  <v-list-item>
                    <v-list-item-title class="text-15">
                      {{character.name}}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-card-text>

            <v-card-actions>
              <v-spacer/>
              <v-pagination light v-model="charactersPage" :length="charactersPageCount" :total-visible="8"/>
            </v-card-actions>

          </v-card>
        </v-col>

        <v-col cols="8">
          <v-sheet color="transparent" min-height="550px">
            <v-row dense>
              <template v-for="(post) in posts.items">
                <v-col cols="auto">
                  <PostCardComponent width="150px" height="150px" :post="post"/>
                </v-col>
              </template>
            </v-row>
          </v-sheet>

          <v-row dense justify="end" align="center">
            <v-pagination v-model="postsPage" :length="postsPageCount" :total-visible="8"/>
          </v-row>
        </v-col>
      </v-row>
    </template>

  </v-container>
</template>


<script lang="ts">
import ArtistCardComponent from "@/components/ArtistCardComponent.vue"
import PostImageComponent from "@/components/PostImageComponent.vue"
import PostCardComponent from "@/components/PostCardComponent.vue"
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import {Component, Ref, Vue, Watch} from 'vue-property-decorator'
import PostService from "@/service/PostService"
import Handler from "@/handlers/Handler"
import Artist, {Source} from "@/model/Artist"
import Post, {Type} from "@/model/Post";
import Category from "@/model/Category";
import CategoryService from "@/service/CategoryService";
import {getModule} from "vuex-module-decorators";
import LangModule from "@/store/LangModule";
import Character from "@/model/Character";
import CharacterService from "@/service/CharacterService";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";

@Component({
  components: {PostCardComponent}
})
export default class CategoryView extends Vue {

  get lang() { return getModule(LangModule).lang }

  category: SingleItem<Category> = { item: new Category() }
  characters: MultipleItem<Character> = { items: [], totalItems: 0 }
  posts: MultipleItem<Post> = { items: [], totalItems: 0 }

  charactersPage: number = 1
  charactersSize: number = 10
  charactersPageCount: number = 0

  postsPage: number = 1
  postsSize: number = 10
  postsPageCount: number = 0

  loading: boolean = false

  created() {
    this.refresh()
  }

  async getCharacters() {
    await Handler.getItems(this, this.characters, () =>
        CharacterService.getCategoryCharacters(this.charactersPage - 1, this.charactersSize, null, this.category.item.id!!)
    )
    this.charactersPageCount = Math.ceil(this.characters.totalItems! / this.charactersSize)
  }

  async getCategoryPosts() {
    await Handler.getItems(this, this.posts, () =>
        PostService.getPublicPosts(0, 30, null, [Number(this.$route.params.id)], null, null)
    )
  }

  async refresh() {
    try {
      await Handler.getItem(this, this.category, () => CategoryService.getPublicCategory(Number(this.$route.params.id)))
      if (this.category.item.id) {
        await this.getCharacters()
        await this.getCategoryPosts()
      }
    } catch (e) { console.log(e) }
  }

  updateCategory() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, `¿Esta seguro de actualizar la categoria?`, async () => {
      try {
        await Handler.getItem(this, this.category, () =>
            CategoryService.updateCategory(Number(this.$route.params.id), this.category.item)
        )
      } catch (e) { console.log(e) }
    }))
  }

  @Watch('charactersPage')
  onPageChanged() { this.refresh() }


}
</script>