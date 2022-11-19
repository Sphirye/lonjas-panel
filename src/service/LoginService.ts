import {Vue} from "vue-property-decorator";
import ConstantTool from "@/service/tool/ConstantTool";
import SnackbarModule from "@/store/SnackbarModule";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import LoginResponse from "@/model/response/LoginResponse";
import JsonTool from "@/service/tool/JsonTool";

export default class LoginService {

    static sessionModule() { return getModule(SessionModule) }

    static async login(component: Vue, email: string, password: string) {

        let formData: FormData = new FormData()
        formData.set("email", email)
        formData.set("password", password)

        // @ts-ignore
        component.loading = true
        try {

            let response = await component.axios.post(ConstantTool.BASE_URL + "/public/auth/login", formData)
            let loginResponse: LoginResponse = JsonTool.jsonConvert.deserializeObject(response.data, LoginResponse)
            this.sessionModule().session.token = "Bearer " + loginResponse.token
            this.sessionModule().session.user = loginResponse.user!
            this.sessionModule().saveSession()

            await component.$router.push("/home")
        } catch (e) {
            getModule(SnackbarModule).makeToast("Algo ha salido mal al iniciar sesión.")
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static isLogged() {
        return (getModule(SessionModule).session.token != null)
    }
}