<template>
  <v-container fluid>
    <v-row dense align="center">
      <h2 class="uni-sans-heavy white--text mx-4">{{ lang.posts }}</h2>
      <v-spacer/>
      <v-sheet color="transparent">
        <v-text-field
            clearable hide-details dense outlined dark rounded
            append-icon="mdi-magnify" :label="lang.search"
        />
      </v-sheet>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row dense>
      <v-col cols="auto" v-for="(post, key) in posts.items" :key="key">
        <PostCardComponent :post="post"/>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="600px">
<!--      <CreateTagDialog :dialog.sync="dialog" @created="this.refresh"/>-->
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import DrawerModule from "@/store/DrawerModule"
import LangModule from "@/store/LangModule"
import {getModule} from "vuex-module-decorators"
import Tag from "@/model/Tag";
import TagService from "@/service/TagService";
import CreateTagDialog from "@/components/dialog/CreateTagDialog.vue";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/model/vue/Dialog";
import Handler from "@/handlers/Handler";
import {MultipleItem} from "@/handlers/interfaces/ContentUI";
import Post from "@/model/Post";
import PostService from "@/service/PostService";
import PostCardComponent from "@/components/PostCardComponent.vue";

@Component({ components: { PostCardComponent } })
export default class PostsView extends Vue {

  lang = getModule(LangModule).lang
  loading: boolean = false
  tag: Tag = new Tag()
  posts: MultipleItem<Post> = { items: [], totalItems: 0 }
  tags: MultipleItem<Tag> = { items: [], totalItems: 0 }
  search: string = ""
  page: number = 1
  size: number = 20
  totalItems: number = 0
  dialog: boolean =false

  created() { this.refresh() }

  async refresh() {

    try {
      await Handler.getItems(this, this.posts, () => PostService.getPosts(
          this.page - 1, this.size, null, null, null, null, null)
      )
    } catch (e) { console.log(e) }
  }
}
</script>

<style scoped>

</style>