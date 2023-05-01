<template>
  <v-card width="100%" dark color="dark-2">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Crear Tag</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">
        <v-row dense align="center" class="ma-4">
          <v-col cols="12">
            <v-text-field
                :label="lang.name" hide-details="auto" outlined dense rounded v-model="tag.item.name"
                :rules="[rules.required, rules.snakeCase]"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
                no-resize :label="lang.description" hide-details="auto" outlined dense
                v-model="tag.item.description" :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="6">
            <v-switch label="NSFW" v-model="tag.item.nsfw" inset hide-details/>
          </v-col>
          <v-col cols="6">
            <v-switch label="Material Raro" v-model="tag.item.weirdMaterial" inset hide-details/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">
        {{ lang.cancel }}
      </v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" @click="createTag">
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
import {SingleItem} from "@/handlers/interfaces/ContentUI";

@Component({ components: { } })
export default class CreateTagDialog extends Vue {

  get rules() { return Rules }

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false
  name: string = ""
  description: string = ""

  tag: SingleItem<Tag> = { item: new Tag() }

  async createTag() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de crear este tag?", async () => {
        await TagService.createTag(this.tag.item)
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