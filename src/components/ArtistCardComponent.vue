<template>
  <v-card outlined dark rounded width="150px" @click="$router.push('/artists/' + artist.id)">
    <v-img contain class="ma-2 pre-blur-image rounded-b" :src="artist.twitter.profileImageUrl"/>
    <v-card-text class="text-center py-0">
      <h3 class="line-clamp">{{ artist.twitter.name }}</h3>
      <p>@{{ artist.twitter.username }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Artist from "@/model/Artist"

@Component
export default class ArtistCardComponent extends Vue {

  @Prop() readonly artist!: Artist
  get lang() { return getModule(LangModule).lang }

}
</script>

<style>
.pre-blur-image .v-image__image{
  image-rendering: crisp-edges !important;
  transition: all 0.5s;
}

.blur-image .v-image__image {
  filter: blur(2px);
  -webkit-filter: blur(2px);
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>