<template>
  <v-container>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-25 grey--text  text--lighten-2 mx-4">{{ lang.users }}</span>
      <v-spacer/>
      <v-sheet color="transparent" width="250px">
        <v-select
            v-model="role" dark :items="roles" label="Rol" outlined clearable
            return-object item-text="name" hide-details dense :menu-props="{ bottom: true, offsetY: true }"
        />
      </v-sheet>
      <v-btn class="mx-2" min-width="20px" width="40px" height="40px" depressed tile outlined dark @click="dialog = true">
        <v-icon dense>far fa-plus</v-icon>
      </v-btn>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="12">
        <v-data-table
            class="elevation-0 transparent" dark hide-default-footer
            :headers="headers" :items="users.items" disable-sort
        >
          <template v-slot:item.createdAt="{ item }">
            {{ item.createdAt.setLocale("es").toFormat('hh:mm a - dd/MM/yy') }}
          </template>

          <template v-slot:item.createdBy="{item}">
            <v-chip class="ma-2" color="info" label outlined v-if="item.createdBy != null">
              {{ item.createdBy.username }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>

      <v-dialog v-model="dialog" width="650px">
        <CreateUserDialog :dialog.sync="dialog" @created="refresh"/>
      </v-dialog>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue"
import {Component, Vue, Watch} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Dialog from "@/model/vue/Dialog"
import Tag from "@/model/Tag"
import User from "@/model/User";
import UserService from "@/service/UserService";
import {AuthorityName} from "@/model/Authority";
import CreateUserDialog from "@/components/dialog/CreateUserDialog.vue";

@Component({ components: { CreateUserDialog } })
export default class TagView extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false
  users: MultipleItem<User> = { items: [], totalItems: 0 }
  get roles() { return this.enumToArray(AuthorityName) }
  role: Nullable<AuthorityName> = null

  historyTypes = [
    { name: this.lang.posts, index: 0 },
    { name: this.lang.users, index: 1 },
    { name: this.lang.tags, index: 2 },
  ]

  headers = [
    { align: 'center', width: 'auto', text: "Nombre de usuario", value: 'username' },
    { align: 'center', width: 'auto', text: "Email", value: 'email' },
    { align: 'center', width: 'auto', text: "Fecha de creación", value: 'createdAt' },
    { align: 'center', width: 'auto', text: "Creado Por", value: 'createdBy' }
  ]

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.users, () => UserService.getUsers(this.page - 1, this.size, this.search, this.role))
    } catch (e) {
      console.log(e)
    }
  }

  enumToArray(enumObj: any): string[] {
    return Object.keys(enumObj)
        .map(key => enumObj[key])
        .filter(value => typeof value === 'string') as string[];
  }

  @Watch("role")
  onRoleChanged() {
    this.refresh()
  }
}
</script>