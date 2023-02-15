<template>
  <v-container>
    <v-card outlined dark color="dark-1">
      <v-card-title>
        <span class="uni-sans-heavy text-md white--text mx-4">Tag</span>
        <v-spacer/>
        <v-switch v-model="tag.item.enabled" label="Activo" hide-details class="my-0 py-0" inset/>
        <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <v-text-field v-model="tag.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
          </v-col>
          <v-col cols="3">
            <v-switch label="Material extraño" hide-details class="my-0 py-0" inset/>
          </v-col>
          <v-col cols="3">
            <v-switch label="NSFW" hide-details class="my-0 py-0" inset/>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red darken-3" @click="deleteTag" depressed tile :disabled="!tag.item.id">
          <span class="font-weight-bold">{{ lang.delete }}</span>
        </v-btn>
        <v-spacer/>
        <v-btn color="green" depressed tile :disabled="!tag.item.id" @click="updateTag">
          <span class="font-weight-bold">{{ lang.save }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>

      <v-dialog v-model="dialog" width="600px">
        <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>
      </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue"
import {Component, Vue} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Dialog from "@/model/vue/Dialog"
import Tag from "@/model/Tag"

@Component({ components: { CreateTagDialog } })
export default class TagView extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false
  tag: SingleItem<Tag> = { item: new Tag() }
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItem(this, this.tag, () => TagService.getTag(this, Number(this.$route.params.id)))
    } catch (e) {
      console.log(e)
    }
  }

  async updateTag() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea actualizar los datos de este tag?", async () => {
      try {
        await Handler.getItem(this, this.tag, () => TagService.updateTag(Number(this.$route.params.id), this.tag.item))
      } catch (e) { console.log(e) } finally {
        // await this.$router.push("/tags")
      }
    }))



  }

  async deleteTag() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de eliminar este tag?", async () => {
      await TagService.deleteTag(this, Number(this.$route.params.id))
      await this.$router.push("/tags")
    }))
  }
}
</script>