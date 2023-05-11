<template>
	<v-snackbar v-model="enabled" :timeout="snackbarModule.timeout" transition="slide-y-reverse-transition">
		<span class="text-15 ma-4">{{ snackbarModule.message }}</span>
	</v-snackbar>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator"
import SnackbarModule from "@/store/SnackbarModule"
import {getModule} from "vuex-module-decorators"

@Component
export default class SnackbarComponent extends Vue {

	snackbarModule: SnackbarModule = getModule(SnackbarModule);

	get enabled() {
		return this.snackbarModule.enabled
	}

	set enabled(v: boolean) {
		this.snackbarModule.setSnackbarEnabled(v)
	}

	@Watch('enabled')
	onChildChanged(val: string) {
		if (!val) {
			this.snackbarModule.checkQueueMessages()
		}
	}

}
</script>