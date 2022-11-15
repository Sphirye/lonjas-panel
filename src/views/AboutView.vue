<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="12">
        <h1 class="text-center font-weight-bold mb-5">Titulo de la vista</h1>
        <p class="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id risus eu purus finibus auctor id sit amet risus. Sed volutpat volutpat sapien. Fusce vitae euismod velit, laoreet tempor eros. Sed ac diam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec sed suscipit leo. Nullam semper felis nec sem condimentum, quis ullamcorper mauris vehicula. Proin posuere, justo eu porttitor congue, dolor dui imperdiet purus, id condimentum lorem magna vel nibh. Vivamus diam sem, ullamcorper ac sapien interdum, feugiat dictum turpis. Aliquam tempor ligula eu metus bibendum, eget bibendum tellus pellentesque. Praesent eu egestas urna.
        </p>

      <v-divider class="ma-10"/>

        <h1 class="text-center font-weight-bold mb-5">Titulo de la vista</h1>
        <p class="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id risus eu purus finibus auctor id sit amet risus. Sed volutpat volutpat sapien. Fusce vitae euismod velit, laoreet tempor eros. Sed ac diam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec sed suscipit leo. Nullam semper felis nec sem condimentum, quis ullamcorper mauris vehicula. Proin posuere, justo eu porttitor congue, dolor dui imperdiet purus, id condimentum lorem magna vel nibh. Vivamus diam sem, ullamcorper ac sapien interdum, feugiat dictum turpis. Aliquam tempor ligula eu metus bibendum, eget bibendum tellus pellentesque. Praesent eu egestas urna.
        </p>
        <p class="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id risus eu purus finibus auctor id sit amet risus. Sed volutpat volutpat sapien. Fusce vitae euismod velit, laoreet tempor eros. Sed ac diam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec sed suscipit leo. Nullam semper felis nec sem condimentum, quis ullamcorper mauris vehicula. Proin posuere, justo eu porttitor congue, dolor dui imperdiet purus, id condimentum lorem magna vel nibh. Vivamus diam sem, ullamcorper ac sapien interdum, feugiat dictum turpis. Aliquam tempor ligula eu metus bibendum, eget bibendum tellus pellentesque. Praesent eu egestas urna.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator'
import Rules from "@/service/tool/Rules"
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import Dialog from "@/model/vue/Dialog"

@Component
export default class AboutView extends Vue {

  @Ref() readonly form!: HTMLFormElement

  get rules() { return Rules }

  validate() {
    getModule(DialogModule).showDialog(new Dialog("Aviso", "¿Desea continuar?", () => {
      alert("Has continuado.")
    }))
  }

}
</script>
