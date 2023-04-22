<template>
  <v-card
      outlined dark color="dark-5" class="ma-1" rounded
      @click="$router.push('/artists/' + artist.id)" :width="width"
  >
    <v-img contain class="ma-2 pre-blur-image rounded-b" height="auto" :src="artist.twitter.profileImageUrl"/>
    <v-card-text class="text-center py-0">
      <h3 class="line-clamp-1">{{ artist.twitter.name }}</h3>
      <p class="line-clamp-1">@{{ artist.twitter.username }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Artist from "@/model/Artist"

@Component
export default class ArtistButtonComponent extends Vue {

  @Prop() readonly artist!: Artist
  @Prop({ default: '200px' }) readonly width!: string
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
</style>