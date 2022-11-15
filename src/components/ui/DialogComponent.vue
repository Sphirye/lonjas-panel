<template>
	<v-dialog v-model="dialog" persistent max-width="500px">
		<v-card>
			<v-card-title class="headline">
				<v-row class="py-1 grey lighten-3" align="center" no-gutters>
					<h5 class="mx-auto grey--text text--darken-2 font-weight-medium align-self-center">{{dialogModule.title}}</h5>
				</v-row>
			</v-card-title>
			<v-card-text style="font-size: 17px;" class="my-2 px-8">{{dialogModule.body}}</v-card-text>
			<v-card-actions>
				<div class="flex-grow-1"></div>
				<v-btn color="secondary" tile @click="dialog = false">{{ lang.cancel }}</v-btn>
				<v-btn color="primary" tile @click="acceptClick()">{{ lang.accept }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import DialogModule from "@/store/DialogModule"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule";

@Component
export default class DialogComponent extends Vue {

	dialogModule: DialogModule = getModule(DialogModule)
	lang: LangModule = getModule(LangModule).lang

	get dialog() { return this.dialogModule.enabled }

	set dialog(enabled: boolean) {
		this.dialogModule.setDialogEnabled(enabled)
	}

	acceptClick() {
		this.dialogModule.setDialogEnabled(false)
		this.dialogModule.callback()
	}

}
</script>