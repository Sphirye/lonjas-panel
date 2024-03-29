<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="4">
        <v-card outlined dark color="dark-3">
          <v-card-title>
            <span class="uni-sans-heavy text-md white--text mx-4">Tag</span>
            <v-spacer/>
            <v-switch readonly @click="setStatus" v-model="tag.item.enabled" label="Activo" hide-details class="my-0 py-0" inset/>
            <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
          </v-card-title>
          <v-card-text>
            <v-row align="center" align-content="center" dense>
              <v-col cols="12">
                <v-text-field v-model="tag.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="tag.item.description" dense outlined dark hide-details no-resize :label="lang.description"/>
              </v-col>

              <v-col cols="6">
                <v-switch v-model="tag.item.nsfw" label="NSFW" hide-details class="my-0 py-0" inset/>
              </v-col>
              <v-col cols="6">
                <v-switch v-model="tag.item.weirdMaterial" label="Material extraño" hide-details class="my-0 py-0 mx-auto" inset/>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn color="red" depressed tile @click="deleteTag">
              <span class="font-weight-bold">{{ lang.delete }}</span>
            </v-btn>
            <v-spacer/>
            <v-btn color="green" depressed tile :disabled="!tag.item.id" @click="updateTag">
              <span class="font-weight-bold">{{ lang.save }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


      <v-col cols="8">
        <PostsGridPaginableComponent :posts.sync="posts" :page.sync="postsPage" :page-count.sync="postsPageCount"/>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
      <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue"
import {Component, Mixins, Vue, Watch} from "vue-property-decorator"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Dialog from "@/model/vue/Dialog"
import Tag from "@/model/Tag"
import Post from "@/model/Post";
import PostCardComponent from "@/components/PostCardComponent.vue";
import PostService from "@/service/PostService";
import PaginationMixin from "@/mixins/PaginationMixin";
import PostsGridPaginableComponent from "@/components/PostsGridPageableComponent.vue";

@Component({components: {PostsGridPaginableComponent, PostCardComponent, CreateTagDialog }})
export default class TagView extends Mixins(PaginationMixin) {

    lang = getModule(LangModule).lang
    loading: boolean = false
    dialog: boolean = false
    tag: SingleItem<Tag> = {item: new Tag()}
    tags: MultipleItem<Tag> = {items: [], totalItems: 0}

    postsPage: number = 1
    postsSize: number = 10
    postsPageCount: number = 0
    posts: MultipleItem<Post> = {items: [], totalItems: 0}

    created() {
        this.refresh()
    }

    async refresh() {
        try {
            await Handler.getItem(this, this.tag, () => TagService.getTag(this, Number(this.$route.params.id)))

            if (this.tag.item.id) {
                await Handler.getItems(this, this.posts, () =>
                    PostService.getPosts(
                        this.postsPage - 1, this.postsSize, null, null, null, null, [this.tag.item.id!!], null
                    )
                )
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateTag() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea actualizar los datos de este tag?", async () => {
            try {
                await Handler.getItem(this, this.tag, () => TagService.updateTag(Number(this.$route.params.id), this.tag.item))
            } catch (e) {
                console.log(e)
            }
        }))
    }

    async deleteTag() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de eliminar este tag?", async () => {
            await TagService.deleteTag(this, Number(this.$route.params.id))
            await this.$router.push("/tags")
        }))
    }

    async setStatus() {
        getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea cambiar el estado de este tag?", async () => {
            await Handler.getItem(this, this.tag, () =>
                TagService.setStatus(this.tag.item.id!, !this.tag.item.enabled)
            )
        }))
    }

    @Watch('charactersPage')
    onPageChanged() {
        this.refresh()
    }
}
</script>