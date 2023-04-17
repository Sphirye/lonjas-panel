<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="4">
        <v-card outlined dark color="dark-3">
          <v-card-title>
            <span class="uni-sans-heavy text-md white--text mx-4">Tag</span>
            <v-spacer/>
            <v-switch v-model="tag.item.enabled" label="Activo" hide-details class="my-0 py-0" inset/>
            <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>
          </v-card-title>
          <v-card-text>
            <v-row align="center" align-content="center">
              <v-col cols="12">
                <v-text-field v-model="tag.item.name" dense outlined dark hide-details rounded :label="lang.name"/>
              </v-col>
              <v-col cols="6">
                <v-switch label="Material extraño" hide-details class="my-0 py-0 mx-auto" inset/>
              </v-col>
              <v-col cols="6">
                <v-switch label="NSFW" hide-details class="my-0 py-0" inset/>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
<!--            <v-btn color="red darken-3" @click="deleteTag" depressed tile :disabled="!tag.item.id">-->
<!--              <span class="font-weight-bold">{{ lang.delete }}</span>-->
<!--            </v-btn>-->
            <v-spacer/>
            <v-btn color="green" depressed tile :disabled="!tag.item.id" @click="updateTag">
              <span class="font-weight-bold">{{ lang.save }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="8">
        <v-row no-gutters>
          <v-sheet color="transparent" min-height="550px">
            <v-row dense>
              <template v-for="(post) in posts.items">
                <v-col cols="auto">
                  <PostCardComponent width="150px" height="150px" :post="post"/>
                </v-col>
              </template>
            </v-row>
          </v-sheet>
        </v-row>

        <v-row>
          <v-spacer/>
          <v-pagination light v-model="postsPage" :length="postsPageCount" :total-visible="8"/>
        </v-row>
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
import {Component, Vue, Watch} from "vue-property-decorator"
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

@Component({ components: {PostCardComponent, CreateTagDialog } })
export default class TagView extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false
  tag: SingleItem<Tag> = { item: new Tag() }
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }


  postsPage: number = 1
  postsSize: number = 10
  postsPageCount: number = 0
  posts: MultipleItem<Post> = { items: [], totalItems: 0 }

  created() {
    this.refresh()
  }

  async refresh() {
    try {
      await Handler.getItem(this, this.tag, () => TagService.getTag(this, Number(this.$route.params.id)))

      if (this.tag.item.id) {
        await Handler.getItems(this, this.posts, () =>
            PostService.getPosts(
                this.postsPage - 1, this.postsSize, null, null, null, [this.tag.item.id!!], null
            )
        )
      }
    } catch (e) { console.log(e) }
  }

  async updateTag() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea actualizar los datos de este tag?", async () => {
      try {
        await Handler.getItem(this, this.tag, () => TagService.updateTag(Number(this.$route.params.id), this.tag.item))
      } catch (e) { console.log(e) }
    }))
  }

  async deleteTag() {
    getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Esta seguro de eliminar este tag?", async () => {
      await TagService.deleteTag(this, Number(this.$route.params.id))
      await this.$router.push("/tags")
    }))
  }

  @Watch('charactersPage')
  onPageChanged() { this.refresh() }
}
</script>