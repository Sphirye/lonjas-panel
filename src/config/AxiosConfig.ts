import VueAxios from "vue-axios";
import {Vue} from "vue-property-decorator"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule";
import axios from "axios"
import {AxiosError} from "axios"

export default class AxiosConfig {

    static init(vue: Vue) {

        Vue.use(VueAxios, axios)

        // axios.defaults.baseURL = ConstantTool.BASE_URL
        axios.interceptors.request.use(request => {
            console.log('Request:', request)
            return request
        })

        axios.interceptors.request.use(config => {
            return config
        })

        axios.interceptors.response.use(response => {
            console.log('Response:', response)
            return response
        }, async (error: AxiosError) => {
            if (error.response && error.response.status == 403) {
                let sessionModule: SessionModule = getModule(SessionModule)
                sessionModule.session.token = ""
                sessionModule.saveSession()
                await vue.$router.push("/login")
            }

            if (error.response && error.response.status == 401) { // TODO implement token refreshing
                let sessionModule: SessionModule = getModule(SessionModule)
                sessionModule.session.token = ""
                sessionModule.saveSession()
                await vue.$router.push("/login")
            }
            console.log("Error: " + error)
            console.log(error.response)
            return Promise.reject(error)
        })


    }

}