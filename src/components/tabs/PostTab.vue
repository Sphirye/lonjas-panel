<template>
  <v-container fluid class="px-0 pt-0">
    <template v-if="post.id">
      <v-card dark color="lonjas-base-2" flat class="px-4">
        <v-card-title class="pb-0">
          <v-row no-gutters align="center">
            <v-avatar>
              <v-img :src="post.artist.twitter.profileImageUrl"/>
            </v-avatar>
            <div class="mx-2">
              <h3 class="font-weight-bold">{{ post.artist.twitter.name }}</h3>
              <h4 class="font-weight-light grey--text text--lighten-2">@{{ post.artist.twitter.username }}</h4>
            </div>
            <v-spacer/>
            <v-menu transition="slide-x-transition" rounded bottom left offset-y :close-on-click="true" :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon dense>fas fa-ellipsis</v-icon>
                </v-btn>
              </template>

              <v-list width="350px" outlined flat color="#5D6162" dark>
                <v-subheader class="text-sm">{{ lang.options }}</v-subheader>
                <div class="px-3"><v-divider/></div>
                <v-list-item-group class="my-2">
                  <v-list-item @click="deletePost">
                    <v-list-item-icon class="mx-2 my-auto">
                      <v-icon>fas fa-trash</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Eliminar post</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>

          </v-row>
        </v-card-title>

        <v-card-text class="py-2">
          <div>
            <h3 class="font-weight-bold">
              {{post.tweet.text}}
            </h3>
          </div>
        </v-card-text>

        <v-card-text class="pt-0">
          <v-row align="start" dense>
            <v-col cols="4">
              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Grupos" clearable
                  :items="categories2.items" v-model="post.categories" item-value="id" cache-items
                  multiple chips deletable-chips small-chips item-text="name" return-object
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Personajes" clearable
                  :items="characters2.items" v-model="post.characters" item-value="id" cache-items
                  multiple chips deletable-chips small-chips item-text="name" return-object
              />
            </v-col>

            <v-col cols="4">

              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Tags" clearable
                  :items="tags2.items" v-model="post.tags" item-value="id" cache-items
                  multiple chips deletable-chips small-chips item-text="name" return-object
              />
            </v-col>

            <v-col cols="12">
              <v-carousel show-arrows>
                <template v-for="(image, key) in post.tweet.images">
                  <v-carousel-item :src="image" :key="key" contain/>
                </template>
              </v-carousel>

            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="indigo" depressed @click="updatePost">
            {{ lang.save }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
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
import Category from "@/model/Category";
import Tag from "@/model/Tag";
import Character from "@/model/Character";
import TagService from "@/service/TagService";
import CharacterService from "@/service/CharacterService";
import CategoryService from "@/service/CategoryService";
import {Route} from "vue-router";
import Handler from "@/handlers/Handler";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";

@Component( { components: { CreatePostDialog, CreatePostTab } } )
export default class PostTab extends Vue {

  get lang() { return getModule(LangModule).lang }

  @Prop() readonly postId!: number
  loading: boolean = false
  dialog: boolean = false
  post: Post = new Post()

  tags: Tag[] = []
  characters: Character[] = []
  categories: Category[] = []

  tags2: MultipleItem<Tag> = { items: [], totalItems: 0 }
  characters2: MultipleItem<Character> = { items: [], totalItems: 0 }
  categories2: MultipleItem<Category> = { items: [], totalItems: 0 }

  created() {
    this.refresh()
  }

  async refresh() {
    await PostService.getPost(this, this.postId)

    if (this.post.id) {

      this.post.tags?.forEach(v => this.tags.push(v))
      this.post.categories?.forEach(v => this.categories.push(v))
      this.post.characters?.forEach(v => this.characters.push(v))


      try {
        try {
          await Handler.getItems(this, this.categories2, () => CategoryService.getPublicCategories(0, 5, null))
          await Handler.getItems(this, this.tags2, () => TagService.getTags2(0, 5, null))
          await Handler.getItems(this, this.characters2, () => CharacterService.getCharacters2(0, 5, null))
        } catch (e) {
          console.log(e)
        }
      } catch (e) {
        console.log(e)
      }

    }

  }

  async updatePost() {
    try {
      await PostService.patchPost(this.postId, this.post)
    }
    catch (e) { console.log(e) }
    // finally { await this.refresh() }
  }

  async deletePost() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de eliminar este post?", async () => {
      try { await PostService.deletePost(this.post.id!!) }
      catch(e) { console.log(e) }
      finally { this.$emit('back') }
    }))
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