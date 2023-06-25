<template>
  <v-autocomplete
      clearable class="rounded" background-color="dark-1" solo flat
      v-model="selectedTags" :items="tags.items"
      item-text="name" item-value="id" :loading="loading" hide-details="auto"
      multiple small-chips :label="lang.tags" v-debounce:200="refresh" dark
      cache-items return-object :search-input.sync="search" ref="autocomplete"
      id="autocomplete"
  />
</template>

<script lang="ts">
import {MultipleItem} from "@/handlers/interfaces/ContentUI"
import {Component, Mixins, PropSync, Ref, VModel, Watch} from 'vue-property-decorator'
import PaginationMixin from "@/mixins/PaginationMixin"
import {getModule} from "vuex-module-decorators"
import TagService from "@/service/TagService"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Tag from "@/model/Tag"
import Character from "@/model/Character";

@Component
export default class TagAutocompleteComponent extends Mixins(PaginationMixin) {

    @VModel({ type: Array }) selectedTags!: Tag[]
    @PropSync("secondaryModel") syncedSecondaryModel!: Tag[]
    @Ref('autocomplete') readonly autocomplete!: any

    loading: boolean = false
    get lang() { return getModule(LangModule).lang }
    tags: MultipleItem<Tag> = { items: [], totalItems: 0 }
    size: number = 10

    created() { this.refresh() }

    async refresh() {
        await Handler.getItems(this, this.tags, () => TagService.getTags(this.page - 1, this.size, this.search, null, null))

        //Check if there is any pre-selected tags and add it to the items array
        this.selectedTags.forEach((tag: Tag) => {
            const exists = this.tags.items.some((item: Tag) => item.id === tag.id)
            if (!exists) { this.tags.items.push(tag) }
        })

    }



}
</script>