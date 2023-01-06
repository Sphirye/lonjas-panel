<template>
  <v-card outlined dark rounded>
    <v-hover v-slot="{ hover }">
      <v-img height="250px" class="ma-1 pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="images[0]">
        <v-expand-transition>
          <v-sheet tile color="rgba(44,48,59,0.84)" v-if="hover" class="d-flex flex-column transition-fast-in-fast-out" style="height: 100%">

            <v-card-title v-if="post.type == Type.TWEET" class="px-2">
              <p class="work-sans font-weight-bold line-clamp-1 text-20 pb-0 mb-0">{{post.artist.twitter.name}}</p>
              <span class="work-sans grey--text mx-auto text-15">@{{post.artist.twitter.username}}</span>
            </v-card-title>

            <v-card-text>
              <p class="work-sans grey--text py-0 my-0 line-clamp-2 text-15">"{{post.tweet.text}}"</p>
            </v-card-text>

            <v-card-actions class="mt-auto">
              <v-spacer/>
              <v-btn icon>
                <v-icon>fab fa-twitter</v-icon>
              </v-btn>
            </v-card-actions>
          </v-sheet>
        </v-expand-transition>
      </v-img>
    </v-hover>
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
  image-rendering: crisp-edges !important;
  transition: all 0.5s;
}

.blur-image .v-image__image {
  filter: blur(2px);
  -webkit-filter: blur(2px);
}
</style>