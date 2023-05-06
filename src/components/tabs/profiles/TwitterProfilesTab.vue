<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-data-table
            :headers="headers" class="elevation-0 transparent" dark hide-default-footer
            disable-filtering disable-sort :items="profiles.items" @click:row="rowClick"
            disable-pagination
        >
          <template v-slot:item._createdAt="{ item }">
            {{ item.createdAt.setLocale("es").toFormat('HH:mm - dd/MM/yy') }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row dense justify="end" align="center">
      <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem} from "@/handlers/interfaces/ContentUI"
import {Component, Vue, Watch} from "vue-property-decorator"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import TwitterUser from "@/model/twitter/TwitterUser"
import Handler from "@/handlers/Handler";
import ProfilesService from "@/service/ProfilesService";

Component.registerHooks(['beforeRouteLeave'])

@Component
export default class TwitterProfilesTab extends Vue {

    lang = getModule(LangModule).lang
    loading: boolean = false
    search: string = ""
    page: number = 1
    size: number = 10
    pageCount: number = 0
    dialog: boolean = false
    profiles: MultipleItem<TwitterUser> = {items: [], totalItems: 0}

    headers = [
        {align: 'center', width: 'auto', text: "Nombre", value: 'name'},
        {align: 'center', width: 'auto', text: "Nombre de usuario", value: 'username'},
        {align: 'center', width: 'auto', text: "Fecha de creación", value: '_createdAt'},
        {align: 'center', width: 'auto', text: "Fuente", value: 'source'},
    ]

    created() {
        this.refresh()
    }

    async refresh() {
        try {
            await Handler.getItems(this, this.profiles, () =>
                ProfilesService.getTwitterProfiles(this.page - 1, this.size, "")
            )
            this.pageCount = Math.ceil(this.profiles.totalItems! / this.size)
        } catch (e) {
            console.log(e)
        }
    }

    rowClick(twitterUser: TwitterUser) {
        this.$router.push(`/profiles/twitter/${twitterUser.id}`)
    }

    @Watch("page")
    onPageChanted() { this.refresh() }

}
</script>

<style>
.test .theme--light.v-table {
    background-color: #00f;
}
</style>