<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-md white--text mx-4">{{ lang.categories }}</span>
      <v-spacer/>
      <v-expand-x-transition>
        <v-sheet class="transparent mr-3" v-if="showSearchBar" dark>
          <v-text-field
              @click:clear="search = ''; resetAll()" @keydown.enter="refresh"
              v-model="search" v-debounce:250ms="resetAll"
              clearable hide-details dense outlined :label="lang.search"
          />
        </v-sheet>
      </v-expand-x-transition>
      <v-btn icon outlined @click="showSearchBar = !showSearchBar" dark class="mr-3">
        <v-icon small>fas fa-search</v-icon>
      </v-btn>
    </v-row>

    <v-progress-linear class="my-2" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="auto" v-for="(category, key) in categories.items" :key="key">
        <v-card outlined dark rounded>
          <v-card-title>
            {{ category.name }}
          </v-card-title>
        </v-card>
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
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Category from "@/model/Category";
import CategoryService from "@/service/CategoryService";

@Component
export default class CategoriesView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  dialog: boolean = false
  loading: boolean = false
  showSearchBar: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  categories: MultipleItem<Category> = {
    items: [],
    totalItems: 0
  }

  get lang() { return getModule(LangModule).lang }
  get rules() { return Rules }

  created() {
    this.refresh()
  }

  validate() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.categories, () => CategoryService.getCategories(this.page - 1, this.size, this.search, null))
    } catch (e) {
      console.log(e)
    }
  }

  resetAll() {
    this.page = 1
    this.refresh()
  }

}
</script>