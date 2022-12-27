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
                  <v-list-item>
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
                  hide-details outlined class="rounded my-1" dense label="Grupos"
                  :items="categories" v-model="post.categories" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Personajes"
                  :items="characters" v-model="post.characters" item-value="id" cache-items
                  multiple chips deletable-chips small-chips item-text="name"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                  hide-details outlined class="rounded my-1" dense label="Tags"
                  :items="tags" v-model="post.tags" item-value="id"
                  multiple chips deletable-chips small-chips item-text="name"
              />
            </v-col>


            <v-col cols="6">
              <v-carousel show-arrows>
                <template v-for="(image, key) in post.tweet.images">
                  <v-carousel-item :src="image" :key="key" contain/>
                </template>
              </v-carousel>

            </v-col>
          </v-row>
        </v-card-text>
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

  created() {
    this.refresh()
  }

  async refresh() {
    await PostService.getPost(this, this.postId)

    if (this.post.id) {
      await TagService.getTags(this, this.tags, 2, 8, null, true)
      await CategoryService.getCategories(this, this.categories, 2, 8, null)
      await CharacterService.getCharacters(this, this.characters, 2, 8, null)
    }

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