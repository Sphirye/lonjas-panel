<template>
  <v-container fluid>
    <v-row dense align="center" class="mx-4">
      <h2 class="uni-sans-heavy white--text">{{ lang.posts }}</h2>
      <v-spacer/>
      <v-sheet color="transparent">
        <v-text-field
            clearable hide-details dense outlined dark rounded append-icon="mdi-magnify"
            :label="lang.search" @keydown.enter="refresh" @click:clear="refresh" v-model="search"
        />
      </v-sheet>
    </v-row>

    <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

    <v-row dense>
      <v-col cols="auto" v-for="(post, key) in posts.items" :key="key">
        <PostCardComponent :post="post"/>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-spacer/>
      <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Vue, Watch} from "vue-property-decorator"
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
import PaginationMixin from "@/mixins/PaginationMixin";

@Component({components: {PostCardComponent}})
export default class PostsView extends Mixins(PaginationMixin) {

    lang = getModule(LangModule).lang
    size = 30
    dialog: boolean = false
    loading: boolean = false
    posts: MultipleItem<Post> = { items: [], totalItems: 0 }

    created() { this.refresh() }

    async refresh() {
        try {
            await Handler.getItems(this, this.posts, () => PostService.getPosts(
                this.page - 1, this.size, this.search, null, null, null, null, null)
            )
            this.setPageCount(this.posts.totalItems!!)
        } catch (e) {
            console.log(e)
        }
    }

    @Watch("page")
    onPageChanged() { this.refresh() }

}
</script>