<template>
  <v-autocomplete
      clearable class="rounded" flat solo background-color="dark-1"
      v-model="selectedCharacters" :items="characters.items"
      
      item-text="name" item-value="id" :loading="loading" hide-details
      multiple small-chips :label="lang.characters" v-debounce:200="refresh" dark
      cache-items return-object :search-input.sync="search" :disabled="disabled"
  >
    <template v-slot:item="{ item, on, attrs }">
      <v-list-item dense v-on="on">
        <v-list-item-action disabled class="mr-3">
          <v-simple-checkbox v-model="attrs.inputValue"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            <h3 class="font-weight-medium">{{ item.name }}</h3>
          </v-list-item-title>
          <v-list-item-subtitle>{{ item.category.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

  </v-autocomplete>
</template>

<script lang="ts">
import {Component, VModel, Mixins, Prop} from 'vue-property-decorator'
import {MultipleItem} from "@/handlers/interfaces/ContentUI"
import CharacterService from "@/service/CharacterService"
import PaginationMixin from "@/mixins/PaginationMixin"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Character from "@/model/Character"
import Handler from "@/handlers/Handler";
import Tag from "@/model/Tag";

@Component
export default class CharacterAutocompleteComponent extends Mixins(PaginationMixin) {

    loading: boolean = false
    get lang() { return getModule(LangModule).lang }
    size = 10

    @VModel({type: Array}) selectedCharacters!: Character[]
    @Prop({ default: false }) readonly disabled!: boolean

    characters: MultipleItem<Character> = { items: [], totalItems: 0 }

    created() { this.refresh() }

    async refresh() {
        await Handler.getItems(this, this.characters, () =>
            CharacterService.getCharacters(this.page - 1, this.size, this.search, null)
        )

        //Check if there is any pre-selected character and add it to the items array
        this.selectedCharacters.forEach((character: Character) => {
            const exists = this.characters.items.some((item: Tag) => item.id === character.id)
            if (!exists) { this.characters.items.push(character) }
        })
    }

}
</script>