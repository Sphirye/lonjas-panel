<template>
  <v-card :width="width" :height="height" outlined class="pa-1" dark rounded @click="$router.push('/posts/' + post.id)">
    <template v-if="images != null">
      <v-hover v-slot="{ hover }">
        <v-img width="100%" height="100%" class="pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="images[0] + '?name=small'">
          <v-expand-transition>
            <v-sheet tile color="rgba(44,48,59,0.84)" v-if="hover" class="d-flex flex-column transition-fast-in-fast-out" style="height: 100%">
              <v-card-text v-if="post.type == Type.TWEET" class="px-2 text-center my-auto">
                <p class="work-sans font-weight-bold line-clamp-1 text-20 pb-0 mx-auto mb-0">{{post.artist.twitter.name}}</p>
                <p class="work-sans grey--text mx-auto text-15">@{{post.artist.twitter.username}}</p>
              </v-card-text>
            </v-sheet>
          </v-expand-transition>
        </v-img>
      </v-hover>
    </template>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import PostService from "@/service/PostService";
import Post, {Type} from "@/model/Post";

@Component({
  computed: {
    Type() {
      return Type
    }
  }
})
export default class PostCardComponent extends Vue {

  @Prop() readonly post!: Post
  @Prop({ default: '200px' }) readonly width!: string
  @Prop({ default: '200px' }) readonly height!: string


  get lang() { return getModule(LangModule).lang }

  get images(): Nullable<string[]> {
    switch (this.post.type) {
      case (Type.TWEET): return this.post.tweet!!.images!!; break;
      default: return null
    }
  }

}
</script>

<style>
.pre-blur-image .v-image__image{

  filter: blur(0.5px);
  -webkit-filter: blur(0.5px);

  image-rendering: crisp-edges !important;
  transition: all 0.5s;
}

.blur-image .v-image__image {
  filter: blur(2px);
  -webkit-filter: blur(2px);
}
</style>