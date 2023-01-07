<template>
  <v-app>
    <HeaderComponent/>
    <DrawerComponent/>
    <v-main class="lonjas-base">
      <transition name="fade" mode="out-in">
        <router-view class="my-4"/>
      </transition>
    </v-main>
    <SnackbarComponent/>
    <DialogComponent/>
    <FooterComponent/>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import SnackbarComponent from "@/components/ui/SnackbarComponent.vue"
import HeaderComponent from "@/components/ui/HeaderComponent.vue"
import FooterComponent from "@/components/ui/FooterComponent.vue"
import DialogComponent from "@/components/ui/DialogComponent.vue"
import DrawerComponent from "@/components/ui/DrawerComponent.vue"
import LoginService from "@/service/LoginService"

@Component({ components: { DialogComponent, SnackbarComponent, HeaderComponent, FooterComponent, DrawerComponent } })
export default class App extends Vue {

  async mounted() {
    // await LoginService.checkSession(this)
  }

}
</script>

<style>

* {
  font-family: 'Work Sans', sans-serif;
  font-weight: normal;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus textarea:-webkit-autofill,
textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  background-clip:content-box;
  -webkit-background-clip: text;
}
</style>