<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-25 grey--text  text--lighten-2 mx-4">Tags</span>
      <v-spacer/>
      <v-sheet color="transparent">
        <v-text-field clearable hide-details dense outlined dark rounded append-icon="mdi-magnify" :label="lang.search"/>
      </v-sheet>
      <v-btn class="mx-2" depressed @click="dialog = true">Añadir</v-btn>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>


    <v-row align="start" dense>
      <template v-for="(tag) in tags.items">
        <v-col cols="auto">
          <v-card flat dark @click="$router.push('/tags/' + tag.id)">
            <v-card-title class="font-weight-regular">
              {{ tag.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
      <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import DrawerModule from "@/store/DrawerModule"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import Tag from "@/model/Tag";
import TagService from "@/service/TagService";
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue";
import {Route} from "vue-router";
import Handler from "@/handlers/Handler";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";

Component.registerHooks(['beforeRouteLeave'])

@Component({ components: { CreateTagDialog } })
export default class TagsService extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false

  tags: MultipleItem<Tag> = {
    items: [],
    totalItems: 0
  }

  created() {
    this.refresh()
  }

  // beforeRouteLeave(to: any, from: any, next: any) {
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   if (answer) {
  //     next()
  //   } else {
  //     next(false)
  //   }
  // }

  async refresh() {
    try {
      await Handler.getItems(this, this.tags, () => { return TagService.getTags(this.page - 1, this.size, this.search, null) })
    } catch (e) {
      console.log(e)
    }
  }

}
</script>

<style scoped>

</style>