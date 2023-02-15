<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="5">
        <v-card outlined dark color="dark-1">
          <v-card outlined dark color="dark-1">
            <v-card-title>
              <span class="uni-sans-heavy text-md white--text mx-4">Personaje</span>
              <v-spacer/>
            </v-card-title>

            <div class="mx-4">
              <v-progress-linear color="grey" :indeterminate="loading"/>
            </div>

            <v-card-text>
              <v-row align="center" dense>
                <v-col cols="12">
                  <v-text-field v-model="character.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
                </v-col>
                <v-col cols="6">
                  <v-select
                      solo background-color="dark-2" dark hide-details="auto" class="my-0 py-0"
                      label="Genero" flat menu-props="offset-y"
                  />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                      solo background-color="dark-2" dark hide-details="auto" class="my-0 py-0"
                      label="Categoría" flat menu-props="offset-y"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-3" @click="deleteCharacter" depressed tile :disabled="!character.item.id">
                <span class="font-weight-bold">{{ lang.delete }}</span>
              </v-btn>
              <v-spacer/>
              <v-btn color="green" depressed tile :disabled="!character.item.id" @click="updateCharacter">
                <span class="font-weight-bold">{{ lang.save }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-card>
      </v-col>


      <v-col cols="7">
        <v-row dense>
          <v-col cols="auto" v-for="(post, key) in posts.items" :key="key">
            <PostCardComponent :post="post"/>
          </v-col>
        </v-row>
      </v-col>
      {{posts}}
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import SessionModule from "@/store/SessionModule";
import Handler from "@/handlers/Handler";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import Category from "@/model/Category";
import CategoryService from "@/service/CategoryService";
import Character from "@/model/Character";
import CharacterService from "@/service/CharacterService";
import CreateCharacterDialog from "@/components/dialog/CreateCharacterDialog.vue";
import TagService from "@/service/TagService";
import Post from "@/model/Post";
import PostService from "@/service/PostService";
import PostCardComponent from "@/components/PostCardComponent.vue";

@Component( { components: {PostCardComponent} })
export default class CharacterView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  loading: boolean = false

  character: SingleItem<Character> = { item: new Character() }

  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }
  categories: MultipleItem<Category> = { items: [], totalItems: 0 }
  posts: MultipleItem<Post> = { items: [], totalItems: 0 }
  genders = {}

  page: number = 1
  size: number = 30

  async created() {
    try {
      await Handler.getItem(this, this.character, () =>
          CharacterService.getCharacter(Number(this.$route.params.id))
      )
    } catch (e) {
      console.log(e)
    }

    if (this.character.item.id) { await this.refresh() }
  }

  validate() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.categories, () => CategoryService.getPublicCategories(0, 5, null))
      await Handler.getItems(this, this.posts, () =>
          PostService.getPosts(this.page - 1, this.size, null, null, [Number(this.$route.params.id)], null, null)
      )
    } catch (e) { console.log(e) }
  }

  deleteCharacter() {

  }

  updateCharacter() {

  }
}
</script>