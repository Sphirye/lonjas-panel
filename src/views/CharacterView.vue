<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="4">
        <v-card outlined dark color="dark-1">
          <v-card outlined dark color="dark-3">
            <v-card-title>
              <span class="uni-sans-heavy text-md white--text mx-4">Personaje</span>
              <v-spacer/>
            </v-card-title>

            <div class="mx-4">
              <v-progress-linear color="grey" :indeterminate="loading"/>
            </div>

            <v-card-text>
              <v-row align="center" justify="center" dense>
                <v-col cols="12">
                  <v-text-field v-model="character.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                      solo background-color="dark-2" dark hide-details="auto" class="my-0 py-0" :items="categories.items"
                      label="Categoría" flat menu-props="offset-y" v-model="character.item.category" item-text="name"
                      return-object
                  />
                </v-col>

                <v-col cols="6">
                  <v-card outlined>
                    <v-card-title class="pb-2">
                      <span>Genero:</span>
                    </v-card-title>
                    <v-divider/>
                    <v-card-text class="pt-0">
                      <template v-for="gender in genders">
                        <v-checkbox :label="gender.name" hide-details="auto" :value="gender.gender" v-model="character.item.gender"/>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>

              </v-row>
            </v-card-text>

            <v-card-actions>

              <v-spacer/>
              <v-btn color="green" depressed tile :disabled="!character.item.id" @click="updateCharacter">
                <span class="font-weight-bold">{{ lang.save }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="8">
        <v-row dense>
          <v-col cols="auto" v-for="(post, key) in posts.items" :key="key">
            <PostCardComponent :post="post" width="150" height="150"/>
          </v-col>
        </v-row>
      </v-col>
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
import Character, {Gender} from "@/model/Character";
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

  genders = [
    { name: "Hombre", gender: Gender.MALE} ,
    { name: "Mujer", gender: Gender.FEMALE },
    { name: "Otro", gender: Gender.OTHER },

  ]

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
      await Handler.getItems(this, this.categories, () => CategoryService.getPublicCategories(0, 10, null))
      await Handler.getItems(this, this.posts, () =>
          PostService.getPosts(this.page - 1, this.size, null, null, [Number(this.$route.params.id)], null, null)
      )
    } catch (e) { console.log(e) }
  }

  updateCharacter() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, `¿Esta seguro de actualizar el personaje?`, async () => {
      await Handler.getItem(this, this.character, () =>
        CharacterService.updateCharacter(Number(this.$route.params.id), this.character.item)
      )
    }))
  }
}
</script>