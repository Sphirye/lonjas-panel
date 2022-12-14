<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-md white--text mx-4">Tag</span>
      <v-spacer/>
      <v-btn class="mx-2" color="red" depressed dark @click="deleteTag">{{ lang.delete }}</v-btn>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="12">
        <v-text-field v-model="tag.name" dense outlined dark hide-details rounded :label="lang.name"/>
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
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";

@Component({ components: { CreateTagDialog } })
export default class TagView extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  tags: Tag[] = []
  tag: Tag = new Tag()
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false


  created() {
    this.refresh()
  }

  async refresh() {
    await TagService.getTag(this, Number(this.$route.params.id))
  }

  async deleteTag() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de eliminar este tag?", async () => {
      await TagService.deleteTag(this, Number(this.$route.params.id))
      await this.$router.push("/tags")
    }))
  }

}
</script>

<style scoped>

</style>