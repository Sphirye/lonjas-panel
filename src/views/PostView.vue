<template>
  <v-container fluid>
    <template v-if="post.item.id != undefined">
      <v-row dense>

        <v-col cols="4" v-if="post.item.id">
          <ArtistCardComponent :artist="post.item.artist"/>
        </v-col>

        <v-col cols="8">
          <v-card outlined dark color="dark-4" v-if="post.item.id">
            <v-card-title class="pb-0">
              <span class="uni-sans-heavy text-md white--text mx-4">Post - {{ post.item.id }}</span>
              <v-spacer/>
              <v-switch readonly @click="setPostStatus" v-model="post.item.enabled" label="Activo" hide-details class="my-0 py-0" inset/>
              <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
            </v-card-title>

            <v-card-text class="py-0">

              <PostImageComponent :post="post.item"/>

            </v-card-text>

            <v-card-text class="py-0 my-2">
              <v-row align="center" dense>
                <v-col cols="6">
                  <TagAutocomplete v-model="tags"/>
                </v-col>

                <v-col cols="6">
                  <CharacterAutocompleteComponent v-model="characters"/>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-3" depressed>
                <span class="font-weight-bold">{{ lang.delete }}</span>
              </v-btn>
              <v-spacer/>
              <v-btn color="green darken-2" depressed @click="updatePost">
                <span class="font-weight-bold">{{ lang.save }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" width="600px">
        <!--      <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>-->
      </v-dialog>
    </template>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue"
import {Component, Vue} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Dialog from "@/model/vue/Dialog"
import Tag from "@/model/Tag"
import PostService from "@/service/PostService";
import Post from "@/model/Post";
import Category from "@/model/Category";
import Character from "@/model/Character";
import Rules from "@/service/tool/Rules";
import CategoryService from "@/service/CategoryService";
import CharacterService from "@/service/CharacterService";
import ArtistService from "@/service/ArtistService";
import ArtistCardComponent from "@/components/ArtistCardComponent.vue";
import PostImageComponent from "@/components/PostImageComponent.vue";
import TagAutocomplete from "@/components/autocomplete/TagAutocompleteComponent.vue";
import CharacterAutocompleteComponent from "@/components/autocomplete/CharacterAutocompleteComponent.vue";

@Component({
    components: {CharacterAutocompleteComponent, TagAutocomplete, PostImageComponent, ArtistCardComponent}
})
export default class PostView extends Vue {

    get rules() { return Rules }

    get lang() { return getModule(LangModule).lang }

    loading: boolean = false
    totalItems: number = 0
    dialog: boolean = false
    post: SingleItem<Post> = { item: new Post() }

    tags: Tag[] = []
    characters: Character[] = []

    async created() {
        try {
            await Handler.getItem(this, this.post, () => PostService.getPost(Number(this.$route.params.id)))
            if (this.post.item.id) {
                this.characters.push(...this.post.item.characters!)
                this.tags.push(...this.post.item.tags!)
                await this.refresh()
            }
        } catch (e) {
            console.log(e)
        }
    }

    async refresh() {
        try {
        } catch (e) {
            console.log(e)
        }
    }

    async updatePost() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea actualizar los datos del post?", async () => {
            try {
                await Handler.getItem(this, this.post, () => PostService.updatePost(Number(this.$route.params.id), this.post.item))
            } catch (e) {
                console.log(e)
            }
        }))
    }

    async setPostStatus() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", async () => {
            await Handler.getItem(this, this.post, () =>
                PostService.setPostStatus(this.post.item.id!, !this.post.item.enabled)
            )
        }))
    }
}
</script>