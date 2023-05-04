<template>
	<v-footer color="dark-2">
		<v-col class="py-4 text-center white--text" cols="12">
			{{ new Date().getFullYear() }} — <strong>Lonjas</strong>
		</v-col>
	</v-footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"

@Component
export default class FooterComponent extends Vue {

}
</script>