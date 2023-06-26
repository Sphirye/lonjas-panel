<template>
  <div>
    <v-row dense align="center">
      <v-col cols="auto" sm="4" md="3" lg="3" xl="3" class="flex" v-for="(post, key) in syncedPosts.items" :key="key">
        <PostCardComponent :post="post"/>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-spacer/>
      <span class="white--text mx-4">Mostrando {{syncedPosts.items.length}} de {{syncedPosts.totalItems}} posts.</span>
      <v-pagination class="white--text" v-model="syncedPage" :length="syncedPageCount" :total-visible="8"/>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop, PropSync} from 'vue-property-decorator'
import {MultipleItem} from "@/handlers/interfaces/ContentUI"
import PaginationMixin from "@/mixins/PaginationMixin"
import Post from "@/model/Post"
import PostCardComponent from "@/components/PostCardComponent.vue";

@Component({
    components: {PostCardComponent}
})
export default class PostGridListComponent extends Mixins(PaginationMixin) {

    @PropSync("posts") syncedPosts!: MultipleItem<Post>
    @PropSync("page") syncedPage!: number
    @PropSync("pageCount") syncedPageCount!: number

}
</script>