<template>
	<v-footer color="lonjas-base-2">
		<v-row justify="center" no-gutters>
			<v-btn color="white" text rounded class="my-2">Button</v-btn>
			<v-btn color="white" text rounded class="my-2">Button</v-btn>
			<v-btn color="white" text rounded class="my-2">Button</v-btn>
		</v-row>

		<v-col class="py-4 text-center white--text" cols="12">
			{{ new Date().getFullYear() }} — <strong>Vuetify</strong>
		</v-col>
	</v-footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"

@Component
export default class FooterComponent extends Vue {

}
</script>