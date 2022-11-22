<template>
  <v-card outlined dark rounded>
    <v-hover v-slot="{ hover }">
      <v-img height="250px" class="mx-3 my-2 pre-blur-image rounded-b" :class="hover ? 'blur-image' : ''" :src="post.images[0]">
        <v-expand-transition>
          <v-sheet tile color="rgba(44,48,59,0.84)" v-if="hover" class="d-flex flex-column transition-fast-in-fast-out" style="height: 100%">
            <div class="px-3 pb-4 pt-2">
              <span class="work-sans font-weight-bold" v-line-clamp="1">{{post.artist.twitter.name}}</span>
              <p class="work-sans grey--text">@{{post.artist.twitter.username}}</p>
              <p class="work-sans grey--text mt-2" v-line-clamp="2">"{{post.description}}"</p>
            </div>

            <v-spacer/>

            <div class="d-flex justify-space-around align-center my-2">
              <v-btn text>
                See Full
              </v-btn>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="blue" v-bind="attrs" v-on="on">
                    <v-icon>fab fa-twitter</v-icon>
                  </v-btn>
                </template>
                <span class="work-sans">Sauce</span>
              </v-tooltip>
            </div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span class="work-sans grey--text mx-auto mb-2" v-bind="attrs" v-on="on">{{ post.category.name }}</span>
              </template>
              <span class="work-sans">{{ lang.category }}</span>
            </v-tooltip>
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
import Post from "@/model/Post";

@Component
export default class PostCardComponent extends Vue {

  @Prop() readonly post!: Post
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