<template>
  <v-dialog v-model="dialog" width="700px" persistent>
    <v-card dark color="dark-2">

      <v-card-title>
        <v-row class="py-1" align="center" no-gutters>
          <h4 class="grey--text text--lighten-2 font-weight-bold">Bienvenida anticipada.</h4>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-progress-linear color="grey"/>
      </v-card-text>

      <v-card-text class="text-body-1">

        <p>¡Hola!</p>

        <p>
          Nos alegra tu interes en este lugar, pero has llegado un poco temprano, por lo que este proyecto continua en desarrollo y eso significa
          que todo lo que veas en esta pagina puede cambiar con el tiempo.
        </p>

        <p class="mb-0">
          Si tienes alguna sugerencia, duda o queja. Estaré encantado de oirlo en nuestro twitter
          <a target="_blank" href="https://twitter.com/lonjas_archive">@lonjas_archive</a>.
        </p>
      </v-card-text>

      <v-card-text>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img class="mx-auto" src="@/assets/myla-mining.webp" max-width="150px" v-bind="attrs" v-on="on"/>
          </template>
          <span>Beloved humming miner, rest in peace.</span>
        </v-tooltip>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn light @click="closeDialog()">Entendido!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'

@Component
export default class DevelopmentDialog extends Vue {

    lastTimeCheckedKey = "last-time-checked"
    dialog: boolean = false

    created() {
        const currentDate = new Date().toLocaleDateString()
        if (localStorage.getItem(this.lastTimeCheckedKey) != currentDate) {
            this.dialog = true
        }
    }

    closeDialog() {
        this.dialog = false
        localStorage.setItem(this.lastTimeCheckedKey, new Date().toLocaleDateString())
    }

}
</script>

<style scoped>

</style>