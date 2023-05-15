<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-25 grey--text text--lighten-2 mx-4">{{ lang.categories }}</span>
      <v-spacer/>
      <div>
        <v-text-field
            @keydown.enter="refresh" v-model="search" hide-details dense outlined :label="lang.search" dark
        />
      </div>
      <v-btn class="mx-2" depressed @click="dialog = true">{{ lang.add }}</v-btn>
    </v-row>

    <v-progress-linear class="my-2" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <template v-for="(category) in categories.items">
        <v-col cols="auto">
          <v-card flat dark @click="$router.push('/categories/' + category.id)">
            <v-card-title class="font-weight-regular">
              {{ category.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <v-row dense align="center">
      <v-spacer/>
      <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
    </v-row>

    <v-dialog v-model="dialog" width="500px">
      <CreateCategoryDialog :dialog.sync="dialog" @created="refresh"/>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Ref, Vue, Watch} from 'vue-property-decorator'
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
import CreateCategoryDialog from "@/components/dialog/CreateCategoryDialog.vue";
import PaginationMixin from "@/mixins/PaginationMixin";

@Component({ components: { CreateCategoryDialog } })
export default class CategoriesView extends Mixins(PaginationMixin) {

    @Ref() readonly form!: HTMLFormElement

    dialog: boolean = false
    loading: boolean = false
    showSearchBar: boolean = false
    categories: MultipleItem<Category> = { items: [], totalItems: 0 }
    size = 50

    get lang() { return getModule(LangModule).lang }
    get rules() { return Rules }
    created() { this.refresh() }

    async refresh() {
        try {
            await Handler.getItems(this, this.categories, () =>
                CategoryService.getCategories(this.page - 1, this.size, this.search, null)
            )
            this.setPageCount(this.categories.totalItems!!)
        } catch (e) { console.log(e) }
    }

    reset() {
        this.resetAll()
        this.refresh()
    }

    @Watch("page")
    onPageChanged() { this.refresh() }

}
</script>