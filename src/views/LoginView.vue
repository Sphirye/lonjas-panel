<template>
  <v-container class="my-16">
    <v-row justify="center">
      <v-form ref="form">
        <v-card flat color="rounded grey darken-3" tile>
          <v-card-title class="pt-10">
            <div class="mx-auto my-auto d-flex flex-column justify-center align-center">
              <v-icon color="grey lighten-4" size="62">far fa-circle-user</v-icon>
              <h3 class="font-weight-regular my-3 white--text">{{ lang.login }}</h3>
            </div>
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                    v-model="email" :label="lang.email" hide-details="auto"
                    :rules="[rules.required, rules.email]" outlined dark
                    @keydown.enter="$refs.loginButton.$el.click()"
                />
              </v-col>
              <v-divider class="white mx-5 my-1"/>
              <v-col cols="12">
                <v-text-field
                    v-model="password" :rules="[rules.required]" :label="lang.password" hide-details="auto"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword" outlined dark
                    @keydown.enter="$refs.loginButton.$el.click()"
                />
              </v-col>
            </v-row>
          </v-card-text>


          <v-card-actions>
            <div class="mx-auto d-flex flex-column justify-center align-center">
              <v-divider class="white mx-5 my-2"/>
              <v-btn depressed color="grey lighten-2" large tile @click="login" ref="loginButton">
                <span class="grey--text text--darken-3">{{ lang.continue }}</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-form>
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
import LoginService from "@/service/LoginService";
import SessionModule from "@/store/SessionModule";

@Component
export default class LoginView extends Vue {

    @Ref() readonly form!: HTMLFormElement

    loading: boolean = false
    email: string = ""
    password: string = ""
    showPassword: boolean = false

    get lang() { return getModule(LangModule).lang }
    get rules() { return Rules }
    get isLogged() { return LoginService.isLogged() }

    async created() {
        if (this.isLogged) { await this.$router.push("/") }
    }

    async login() {
        if (this.form.validate()) {
            await LoginService.login(this, this.email, this.password)
            if (this.isLogged) await this.$router.push("/")
        }
    }

}
</script>

<style>
.input-dark-error .v-text-field__details .error--text {
    color: rgb(226, 226, 226) !important;
    caret-color: rgb(226, 226, 226) !important;
    font-weight: 600;
}
</style>