<template>
  <v-container fluid>
    <v-row dense align="center">
      <span class="uni-sans-heavy text-md white--text mx-4">{{ lang.artists }}</span>
      <v-spacer/>
      <v-expand-x-transition>
        <v-sheet class="transparent mr-3" v-if="showSearchBar" dark>
          <v-text-field
              @click:clear="search = ''; resetAll()"
              v-model="search" v-debounce:250ms="resetAll"
              clearable hide-details dense outlined :label="lang.search"
          />
        </v-sheet>
      </v-expand-x-transition>
      <v-btn icon outlined @click="showSearchBar = !showSearchBar" dark class="mr-3">
        <v-icon small>fas fa-search</v-icon>
      </v-btn>

      <v-btn icon outlined @click="dialog = true" dark class="mr-3">
        <v-icon small>fas fa-plus</v-icon>
      </v-btn>
    </v-row>
    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row align="start" dense>
      <v-col cols="auto" v-for="(artist, key) in artists" :key="key">
        <ArtistCardComponent :artist="artist"/>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
      <RegisterArtistDialog :dialog.sync="dialog" v-if="dialog" @created="refresh"/>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import DrawerModule from "@/store/DrawerModule"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import Artist from "@/model/Artist";
import ArtistService from "@/service/ArtistService";
import ArtistCardComponent from "@/components/ArtistCardComponent.vue";
import RegisterArtistDialog from "@/components/dialog/RegisterArtistDialog.vue";

@Component( { components: { ArtistCardComponent, RegisterArtistDialog } } )
export default class ArtistsView extends Vue {

  artist: Artist = new Artist()
  artists: Artist[] = []

  dialog: boolean = false
  loading: boolean = false
  page: number = 1
  size: number = 20
  search: string = ""
  showSearchBar: boolean = false

  get lang() { return getModule(LangModule).lang }

  created() {
    this.refresh()
  }

  async refresh() {
    await ArtistService.getArtists(this, this.artists, this.page - 1, this.size, this.search)
  }

  resetAll() {
    this.page = 1
    this.refresh()
  }

}
</script>
