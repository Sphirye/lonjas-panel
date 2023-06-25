<template>
  <v-card flat dark>
    <v-card-title class="mx-3">
      <v-avatar size="128" class="mr-4 pointer" @click="toArtistPage">
        <v-img contain :src="artist.twitter.profileImageUrl"/>
      </v-avatar>

      <div v-if="artist.source === Source.TWITTER">
        <span class="text-20 font-weight-bold grey--text text--lighten-2 pointer" @click="toArtistPage">{{ artist.twitter.name }}</span>
        <br/>
        <span class="font-weight-medium grey--text pointer" @click="toArtistPage">@{{ artist.twitter.username }}</span>
      </div>

    </v-card-title>

    <v-card-actions class="justify-center">
      <v-spacer/>
      <v-btn outlined v-if="artist.twitter" icon color="grey ligthen-5" depressed width="50px" height="50px" target="_blank" :href="`https://twitter.com/${artist.twitter.username}`" style="text-decoration: none;">
        <v-icon color="blue">fab fa-twitter</v-icon>
      </v-btn>
    </v-card-actions>

    <v-divider class="mx-3"/>

    <v-card-text>
      <template v-if="artist.source === Source.TWITTER" style="white-space: pre-wrap;" class="mx-4 font-weight-regular text-15">
        <v-card outlined>
          <v-card-text>
            {{ artist.twitter.description }}
          </v-card-text>
        </v-card>
      </template>
    </v-card-text>

    <v-divider class="mx-3"/>

    <v-card-text>
      <v-card outlined>
        <v-card-actions>
          <v-subheader>Perfiles</v-subheader>
          <v-spacer/>
          <v-btn
              v-if="artist.twitter" depressed width="50px" height="50px"
              @click="$router.push(`/profiles/twitter/${artist.twitter.id}`)" fab
          >
            <v-icon color="blue">fab fa-twitter</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>

    <v-divider class="mx-3"/>

    <v-card-text v-if="post != undefined">
      <v-card outlined>
        <v-card-text>
          <div class="d-flex justify-space-around">
            <div class="d-flex flex-column px-3">
              <span>{{ lang.categories }}:</span>
              <template v-for="(category) in post.categories">
                <a class="my-0 text-start" @click="$router.push('/categories/' + category.id)"> {{ category.name }} </a>
              </template>
            </div>

            <v-divider vertical/>

            <div class="d-flex flex-column px-3">
              <span>{{ lang.characters }}:</span>
              <template v-for="(character) in post.characters">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <a class="my-0 text-start" v-html="character.name" v-bind="attrs" v-on="on"/>
                  </template>
                  <span>{{ character.category.name }}</span>
                </v-tooltip>
              </template>
            </div>
          </div>

          <v-divider class="my-3"/>

          <div class="d-flex flex-column px-3">
            <span class="text-center">{{ lang.tags }}:</span>
            <div class="text-center">
              <template v-for="(tag) in post.tags">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <a class="my-0 mx-1 text-start" @click="$router.push('/tags/' + tag.id)" v-bind="attrs" v-on="on" v-text="tag.name"/>
                  </template>
                  <span>{{ tag.description || "Descripción indefinida." }}</span>
                </v-tooltip>
              </template>
            </div>
          </div>

          <v-divider class="my-3"/>

          <div class="text-center">
            <a class="my-0 mx-1 text-start" target="_blank" :href="`https://twitter.com/${artist.twitter.username}/status/${post.tweet.id}`"> Fuente </a>
          </div>

        </v-card-text>
      </v-card>
    </v-card-text>

  </v-card>
</template>

<script lang="ts">
import PostCardComponent from "@/components/PostCardComponent.vue"
import {Component, Prop, Ref, Vue, Watch} from 'vue-property-decorator'
import ArtistService from "@/service/ArtistService"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import Artist, {Source} from "@/model/Artist"
import Post from "@/model/Post";
import PostService from "@/service/PostService";
import RouterTool from "@/service/tool/RouterTool";
import Tab from "@/model/vue/Tab";
import Handler from "@/handlers/Handler";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";

@Component({
        computed: { Source() { return Source } },
        components: { PostCardComponent }
    }
)

export default class ArtistCardComponent extends Vue {

    @Prop() readonly artist!: Artist
    @Prop(Post) readonly post!: Post | undefined
    @Prop() readonly totalPostCount?: number

    get lang() { return getModule(LangModule).lang }

    toArtistPage() {
        this.$router.push("/artists/" + this.artist.id).catch(() => {
        })
    }

}
</script>