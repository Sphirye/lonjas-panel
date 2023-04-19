<template>
  <v-sheet dark outlined class="rounded" :height="height" :width="width">
    <v-carousel ref="carousel" show-arrows v-model="index" height="100%">
      <template v-for="(image, key) in images">
        <v-carousel-item :src="image" :key="key" contain/>
      </template>

      <template v-slot:prev="{ on, attrs }">
        <v-btn icon x-large v-bind="attrs" v-on="on" :disabled="!prevAvailable">
          <v-icon color="white">fas fa-angle-left</v-icon>
        </v-btn>
      </template>

      <template v-slot:next="{ on, attrs }">
        <v-btn icon x-large v-bind="attrs" v-on="on" :disabled="!nextAvailable">
          <v-icon color="white">fas fa-angle-right</v-icon>
        </v-btn>
      </template>
    </v-carousel>
  </v-sheet>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Post, {Type} from "@/model/Post"

@Component
export default class PostImageComponent extends Vue {

  @Prop() readonly post!: Post
  @Prop({ default: '100%' }) readonly width!: string
  @Prop({ default: '600px' }) readonly height!: string
  @Ref('carousel') readonly carousel!: any

  mounted() { window.addEventListener('keydown', this.handleKeyDown) }

  beforeDestroy() { window.removeEventListener('keydown', this.handleKeyDown) }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowLeft": {
        this.prevAvailable ? this.carousel.prev() : null
        break;
      }
      case "ArrowRight": {
        this.nextAvailable ? this.carousel.next() : null
        break
      }

      default: { break }
    }
  }

  index: number = 0

  get lang() { return getModule(LangModule).lang }
  get images(): string[] {
    let urls: string[] = []

    switch (this.post.type) {
      case Type.TWEET: { urls = urls.concat(this.post.tweet!!.images!!); break; }
    }

    return urls
  }

  get prevAvailable() { return !(this.index === 0) }
  get nextAvailable() { return !(this.index + 1 === this.images.length) }

}
</script>