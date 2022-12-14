<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-md white--text mx-4">Tags</span>
      <v-spacer/>
      <v-sheet color="transparent">
        <v-text-field
            clearable hide-details dense outlined dark rounded
            append-icon="mdi-magnify" :label="lang.search"
        />
      </v-sheet>
      <v-btn class="mx-2" depressed @click="dialog = true">Añadir</v-btn>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="auto" v-for="(tag, key) in tags" :key="key">
        <v-card outlined dark>
          <v-card-title>
            {{ tag.name }}
          </v-card-title>
        </v-card>
      </v-col>
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

@Component({ components: { CreateTagDialog } })
export default class TagsService extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  tags: Tag[] = []
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false


  created() {
    this.refresh()
  }

  async refresh() {
    await TagService.getTags(this, this.tags, this.page - 1, this.size, this.search)
  }

}
</script>

<style scoped>

</style>