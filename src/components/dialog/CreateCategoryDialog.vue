<template>
  <v-card dark color="dark-2">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Crear Categoría</h4>
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
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">
        {{ lang.cancel }}
      </v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" @click="createCategory">
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
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Category from "@/model/Category";
import Handler from "@/handlers/Handler";
import CategoryService from "@/service/CategoryService";
import CharacterService from "@/service/CharacterService";

@Component
export default class CreateCategoryDialog extends Vue {

  get rules() { return Rules }

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false

  name: string = ""

  async createCategory() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de crear esta categoría?", async () => {
        await CategoryService.createCategories(this.name)
        this.$emit("created")
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

<style scoped>

</style>