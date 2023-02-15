<template>
  <v-container fluid class="fill-height align-start justify-start">

    <v-row dense align="center" justify="start">
      <span class="uni-sans-heavy text-25 grey--text text--lighten-2 mx-4">{{ lang.home }}</span>
      <v-spacer/>
    </v-row>

    <v-progress-linear class="my-2" color="grey" :indeterminate="loading"/>

		<v-row align="start" justify="center" class="fill-height">

      <v-col cols="6">
        <v-card outlined color="dark-4" dark>
          <v-subheader class="my-0 my-0">Posts recientes:</v-subheader>
          <v-card-text class="pt-0">
            <div class="d-flex justify-center flex-wrap">
              <div v-for="(post, key) in posts.items" :key="key">
                <PostCardComponent width="150px" height="150px" :post="post"/>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card dark color="dark-4" flat min-height="200px">
          <v-subheader>Artistas añadidos recientemente:</v-subheader>
          <v-card-text class="pt-0">
            <div class="d-flex justify-center flex-wrap">
              <template v-for="(artist, key) in artists.items">
                <ArtistCardComponent :artist="artist"/>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

			<v-col cols="12">
        <v-card outlined color="dark-4" dark>
          <v-card-text>
            <p class="text-center text-35">
              Bienvenidos a <span class="uni-sans-heavy text-35 grey--text text--lighten-1">Lonjas</span>
            </p>

            <p class="text-center my-0">
              Para obtener ayuda sobre este panel, por favor póngase en contacto con nosotros a través de esotilin@gmail.com
            </p>
          </v-card-text>
        </v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"
import SessionModule from "@/store/SessionModule";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Post from "@/model/Post";
import Artist from "@/model/Artist";
import Handler from "@/handlers/Handler";
import PostService from "@/service/PostService";
import PostCardComponent from "@/components/PostCardComponent.vue";
import ArtistCardComponent from "@/components/ArtistCardComponent.vue";
import ArtistService from "@/service/ArtistService";

@Component({components: {ArtistCardComponent, PostCardComponent }})
export default class HomeView extends Vue {

	@Ref() readonly form!: HTMLFormElement
  loading: boolean = false
  search: string = ""
  posts: MultipleItem<Post> = { items: [], totalItems: 0 }
  artists: MultipleItem<Artist> = { items: [], totalItems: 0 }
  get lang() { return getModule(LangModule).lang }
	get rules() { return Rules }

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItems(this, this.posts, () => PostService.getPosts(
          0, 20, null, null, null, null, null)
      )
      await Handler.getItems(this, this.artists, () => ArtistService.getArtists(0, 20, null))

    } catch (e) { console.log(e) }
  }

  resetAll() {
    // this.page = 1
    this.refresh()
  }

}
</script>

<style>
</style>