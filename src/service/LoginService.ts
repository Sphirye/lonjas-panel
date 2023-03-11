import {Vue} from "vue-property-decorator";
import ConstantTool from "@/service/tool/ConstantTool";
import SnackbarModule from "@/store/SnackbarModule";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import LoginResponse from "@/model/response/LoginResponse";
import JsonTool from "@/service/tool/JsonTool";
import axios, {AxiosError} from "axios";
import Session from "@/model/Session";
import User from "@/model/User";
import Authority from "@/model/Authority";

export default class LoginService {

    static sessionModule() { return getModule(SessionModule) }

    static async login(component: Vue, email: string, password: string) {

        let formData: FormData = new FormData()
        formData.set("email", email)
        formData.set("password", password)

        try {
            let response = await axios.post(ConstantTool.BASE_URL + "/public/auth/login", formData)
            let loginResponse = JsonTool.jsonConvert.deserializeObject(response.data, LoginResponse)
            this.sessionModule().setSession(this.createSession(loginResponse))
            console.log(this.sessionModule().session)
            return this.sessionModule().session
        } catch (e) {
            getModule(SnackbarModule).makeToast("Algo ha salido mal al iniciar sesión.")
            return Promise.reject(e)
        }
    }

    static createSession(loginResponse: LoginResponse): Session {
        let session = new Session()
        session.token = "Bearer " + loginResponse.token
        session.user = loginResponse.user!
        session.authorities = loginResponse.authorities!
        return session
    }

    static async checkSession(component: Vue) {
        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + "/api/auth/check", {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
        } catch (e) {
            await LoginService.logout()
            return Promise.reject(e) }

    }

    static async logout() {
        this.sessionModule().destroySession()
    }

    static isLogged() {
        return (
            this.sessionModule().session != null &&
            this.sessionModule().session.token != null &&
            this.sessionModule().session.token != ""
        )
    }
}