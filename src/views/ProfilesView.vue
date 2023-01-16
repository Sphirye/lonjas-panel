<template>
  <v-container>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-25 grey--text  text--lighten-2 mx-4">Perfiles</span>
      <v-spacer/>
      <v-sheet color="transparent" width="250px">
        <v-select
            v-model="source" dark :items="items" label="Fuente" outlined
            return-object item-text="name" hide-details dense :menu-props="{ bottom: true, offsetY: true }"
        >
          <template v-slot:item="{ active, item, attrs, on }">
            <v-list-item selectable v-on="on" v-bind="attrs" #default="{ active }">
              <v-list-item-title>
                <v-icon>{{ item.icon }}</v-icon>
                <span class="mx-3">{{ item.name }}</span>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
<!--        <v-text-field clearable hide-details dense outlined dark rounded append-icon="mdi-magnify" :label="lang.search"/>-->
      </v-sheet>
      <v-btn class="mx-2" min-width="20px" width="40px" height="40px" depressed tile outlined dark @click="dialog = true">
        <v-icon dense>far fa-plus</v-icon>
      </v-btn>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="12">
        <TwitterProfilesTab/>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
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
import Source from "@/model/vue/Source";
import TwitterProfilesTab from "@/components/tabs/profiles/TwitterProfilesTab.vue";

Component.registerHooks(['beforeRouteLeave'])

@Component({ components: { TwitterProfilesTab } })
export default class ProfilesView extends Vue {

  items: Source[] = [
    { name: "Twitter", icon: "fab fa-twitter", id: "twitter" },
  ]
  source: Source = this.items[0]

  lang = getModule(LangModule).lang
  loading: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false

  headers = [
    {align: 'center', width: 'auto', text: "Nombre", value: 'name'}
  ]

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