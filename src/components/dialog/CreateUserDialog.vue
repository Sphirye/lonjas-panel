<template>
  <v-card width="100%" dark color="dark-4">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Crear Usuario</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">
        <v-row dense align="start" class="ma-4">
          <v-col cols="6">
            <v-text-field
                label="Nombre de usuario" hide-details="auto" outlined dense rounded
                v-model="userRequest.username" :rules="[rules.required, rules.minLength(5), rules.noSpaces]"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
                label="Email" hide-details="auto" outlined dense rounded
                v-model="userRequest.email" :rules="[rules.required, rules.email]"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
                label="Contraseña" hide-details="auto" outlined dense rounded v-model="userRequest.password"
                :rules="[rules.required, rules.minLength(8), rules.noSpaces]"
            />
          </v-col>
          <v-col cols="6">
            <v-select
                v-model="role" dark :items="roles" label="Rol" outlined clearable
                return-object item-text="name" hide-details="auto" dense :menu-props="{ bottom: true, offsetY: true }"
                :rules="[rules.required]"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">{{ lang.cancel }}</v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" @click="createUser">{{ lang.continue }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, PropSync, Ref, Vue} from "vue-property-decorator"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import TagService from "@/service/TagService";
import Rules from "@/service/tool/Rules";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";
import UserRequest from "@/model/dto/UserRequest";
import {AuthorityName} from "@/model/Authority";
import Handler from "@/handlers/Handler";
import {SingleItem} from "@/handlers/interfaces/ContentUI";
import User from "@/model/User";
import UserService from "@/service/UserService";

@Component({ components: { } })
export default class CreateUserDialog extends Vue {

  get rules() { return Rules }

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false
  name: string = ""
  userRequest = new UserRequest()
  user: SingleItem<Nullable<User>> = { item: null }
  get roles() { return this.enumToArray(AuthorityName) }
  role: Nullable<AuthorityName> = null

  created() {
  }

  async createUser() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de crear este tag?", async () => {

        switch (this.role) {
          case (AuthorityName.ADMIN): {
            await Handler.getItem(this, this.user, () => UserService.postAdminUser(this.userRequest))
            break;
          }
        }

        this.$emit("created")
        this.close()
      }))
    }
  }

  enumToArray(enumObj: any): string[] {
    return Object.keys(enumObj)
        .map(key => enumObj[key])
        .filter(value => typeof value === 'string') as string[];
  }

  close() {
    this.syncedDialog = false
    this.name = ""
  }

}
</script>