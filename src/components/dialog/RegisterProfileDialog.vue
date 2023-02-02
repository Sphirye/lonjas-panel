<template>
  <v-card width="100%" dark color="lonjas-base-2">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Registrar Perfil</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">
        <v-row dense align="center" class="ma-4">
          <v-col cols="12">
            <v-select
                v-model="source" dark :items="items" label="Fuente" outlined return-object
                item-text="name" hide-details rounded :menu-props="{ bottom: true, offsetY: true }"
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
          </v-col>

          <v-col cols="12">
            <v-tabs-items v-model="tab" class="transparent pa-2">
              <v-tab-item value="twitter">
                <v-row justify="center" align="center">
                  <v-col cols="12" class="d-flex">
                    <v-text-field label="Nombre de usuario" hide-details outlined prefix="@" dense rounded v-model="username" dark :rules="[rules.required]"/>
                    <v-btn icon class="mx-2" dark outlined @click="getTwitterUser">
                      <v-icon small>fas fa-arrows-rotate</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
        <v-divider/>

        <v-expand-transition>
          <v-row v-show="twitterUser.id" class="pt-4 px-4" dense>
            <v-col cols="6" class="d-flex align-center">
              <v-avatar size="40" class="mx-2">
                <v-img :src="twitterUser.profileImageUrl"/>
              </v-avatar>
              <v-text-field v-model="twitterUser.username" append-icon="fab fa-twitter" prefix="@" label="Nombre de usuario" disabled outlined dark rounded dense hide-details/>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="twitterUser.name" label="Nombre" disabled outlined dark rounded dense hide-details/>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="twitterUser.id" label="Id" disabled outlined dark rounded dense hide-details :rules="[rules.required]"/>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">{{ lang.cancel }}</v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" :disabled="!twitterUser.id" @click="registerArtist">{{ lang.continue }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, PropSync, Ref, Vue, Watch} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import Source from "@/model/vue/Source";
import TwitterUser from "@/model/twitter/TwitterUser";
import TwitterUserService from "@/service/TwitterUserService";
import ArtistService from "@/service/ArtistService";
import Handler from "@/handlers/Handler";
import {SingleItem} from "@/handlers/interfaces/ContentUI";

@Component
export default class RegisterProfileDialog extends Vue {

  get rules() { return Rules }

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false
  username: string = ""
  source: Source = new Source()
  tab: string = ""
  twitterUser: TwitterUser = new TwitterUser()

  items: Source[] = [
    { name: "Twitter", icon: "fab fa-twitter", id: "twitter" },
  ]

  created() {
  }

  async registerArtist() {
    let lmao: SingleItem<any> = { item: undefined }
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "Este usuario será registrado.", async () => {

        if (this.source.id == "twitter") {
          await Handler.getItem(this,  lmao, () =>
          TwitterUserService.registerTwitterUserByUsername(this.username))
        }

        this.$emit("refresh")
        this.close()
      }))
    }
  }

  async getTwitterUser() {
    this.twitterUser = new TwitterUser()
    await TwitterUserService.getTwitterUserByUsername(this, this.username)
  }

  close() {
    this.syncedDialog = false
    this.$emit("update:syncedDialog")
  }

  @Watch("source")
  onSourceChanged() {
    if (this.source.id) {
      this.tab = this.source.id
    }
  }

}
</script>

<style>


</style>