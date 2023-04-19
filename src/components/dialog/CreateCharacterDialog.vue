<template>
  <v-card dark color="dark-2">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Crear Personaje</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">
        <v-row dense align="center" class="ma-4">
          <v-col cols="12">
            <v-text-field label="Nombre" hide-details outlined dense rounded v-model="name" :rules="[rules.required]"/>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
                label="Categoría" hide-details outlined dense rounded :search-input.sync="categorySearch"
                v-model="category" :items="categories.items" item-text="name" v-debounce:200="refresh"
                :rules="[rules.required2]" clearable return-object dark required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">
        {{ lang.cancel }}
      </v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" @click="createCharacter">
        {{ lang.continue }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, PropSync, Ref, Vue} from "vue-property-decorator"
import DrawerModule from "@/store/DrawerModule"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import Tag from "@/model/Tag";
import TagService from "@/service/TagService";
import Rules from "@/service/tool/Rules";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";
import PostService from "@/service/PostService";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import Category from "@/model/Category";
import Handler from "@/handlers/Handler";
import CategoryService from "@/service/CategoryService";
import CharacterService from "@/service/CharacterService";
import Character from "@/model/Character";

@Component
export default class CreateCharacterDialog extends Vue {

  get rules() { return Rules }
  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false

  name: string = ""
  categorySearch: string = ""
  category: Nullable<Category> = null
  character: SingleItem<Character> = { item: new Character() }

  categories: MultipleItem<Category> = { items: [], totalItems: 0 }

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.categories, () =>
          CategoryService.getPublicCategories(0, 10, this.categorySearch)
      )
    } catch (e) { console.log(e) }
  }

  async createCharacter() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de crear este personaje?", async () => {
        await Handler.getItem(this, this.character, () =>
          CharacterService.createCharacter(this.name, this.category!!.id!!)
        )
        await this.$emit("created")
        this.close()
      }))
    }
  }

  close() {
    this.syncedDialog = false
    this.name = ""
  }

}
</script>