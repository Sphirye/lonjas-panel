<template>
  <v-container>
		<v-row>
			<v-col cols="6">
				<v-form ref="form">
					<v-text-field :label="lang.search" :rules="[rules.required, rules.email]"/>
					<v-btn @click="validate">XD</v-btn>
				</v-form>
			</v-col>
      <v-col cols="6">
        <h1 class="font-weight-bold grey--text text--darken-3 custom-borderline">Borderline Example</h1>
      </v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator'
import {getModule} from "vuex-module-decorators"
import DialogModule from "@/store/DialogModule"
import LangModule from "@/store/LangModule"
import Rules from "@/service/tool/Rules"
import Dialog from "@/model/vue/Dialog"

@Component
export default class HomeView extends Vue {

	@Ref() readonly form!: HTMLFormElement

  get lang() { return getModule(LangModule).lang }
	get rules() { return Rules }

	validate() {
		getModule(DialogModule).showDialog(new Dialog(this.lang.warning, "¿Desea continuar?", () => {
			alert("Has continuado.")
		}))
	}

}
</script>
