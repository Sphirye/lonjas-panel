<template>
  <v-card width="100%" dark color="lonjas-base-2">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Registrar Artista</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">
        <v-row dense align="center" class="ma-4">
          <v-col cols="12">
            <v-select v-model="source" clearable dark :items="items" label="Fuente" outlined return-object item-text="name" hide-details rounded>
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
                    <v-autocomplete
                        label="Escoge un perfil" outlined dark rounded :search-input.sync="search" v-model="twitterUser"
                        :menu-props="{ bottom: true, offsetY: true, dark: true }" v-debounce:200ms="getTwitterUsers"
                        :items="twitterUsers.items" item-text="username" :rules="[rules.required]" clearable return-object
                    >
                      <template v-slot:item="data">
                        <v-list-item-icon class="mr-3">
                          <v-avatar>
                            <v-img :src="data.item.profileImageUrl"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            <h3 class="font-weight-medium">{{ data.item.name }}</h3>
                          </v-list-item-title>
                          <v-list-item-subtitle>{{ data.item.username }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
        <v-divider/>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn depressed class="secondary font-weight-bold" @click="close">{{ lang.cancel }}</v-btn>
      <v-btn depressed class="success darken-2 font-weight-bold" :disabled="!twitterUser" @click="registerArtist">{{ lang.continue }}</v-btn>
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
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Handler from "@/handlers/Handler";
import ProfilesService from "@/service/ProfilesService";

@Component
export default class RegisterArtistDialog extends Vue {

  get rules() { return Rules }

  @PropSync('dialog', { type: Boolean }) syncedDialog!: boolean
  @Ref() readonly form!: HTMLFormElement
  lang = getModule(LangModule).lang
  loading: boolean = false
  username: string = ""
  tab: string = ""
  twitterUser: Nullable<TwitterUser> = new TwitterUser()
  twitterUsers: MultipleItem<TwitterUser> = { items: [], totalItems: 0 }

  items: Source[] = [
    { name: "Twitter", icon: "fab fa-twitter", id: "twitter" },
  ]

  search: string = ""

  source: Source = new Source()

  created() {  }

  async registerArtist() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "Este usuario será registrado.", async () => {

        if (this.source.id == "twitter") {
          await ArtistService.createFromTwitter(this, this.twitterUser!!.id!!)
        }

        this.$emit("created")
        this.$emit("refresh")
        this.close()
      }))
    }
  }

  async getTwitterUsers() {
    try {
      await Handler.getItems(this, this.twitterUsers, () =>
        ProfilesService.getTwitterProfiles(0, 10, this.search)
      )
    } catch (e) { console.log(e) }
  }

  close() {
    this.syncedDialog = false
  }

  @Watch("source")
  onSourceChanged() {
    if (this.source.id) {
      this.tab = this.source.id
      this.getTwitterUsers()
    }
  }

}
</script>

<style>


</style>