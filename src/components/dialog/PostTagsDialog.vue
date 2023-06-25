<template>
  <v-card dark color="dark-4">
    <v-card-title>
      <v-row class="py-1" align="center" no-gutters>
        <h4 class="grey--text text--lighten-2 font-weight-bold">Editar tags del post</h4>
      </v-row>
    </v-card-title>

    <div class="mx-4">
      <v-progress-linear color="grey" :indeterminate="loading"/>
    </div>

    <v-card-text>
      <v-form ref="form">

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Vue, Component, Ref, Mixins} from 'vue-property-decorator'
import PaginationMixin from "@/mixins/PaginationMixin"

@Component({})
export default class PostTagsDialog extends Mixins(PaginationMixin) {

    @Ref() readonly form!: HTMLFormElement
    loading: boolean = false

    created() {
      this.refresh()
    }

    refresh() {

    }
}
</script>

<style scoped>

</style>