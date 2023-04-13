import VueAxios from "vue-axios";
import {Vue} from "vue-property-decorator"
import axios from "axios"
import {AxiosError} from "axios"
import LoginService from "@/service/LoginService";

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
            if (error.response) {

                if (error.response.status == 403 || error.response.status == 401) {
                    await LoginService.logout()
                    await vue.$router.push("/login").catch(() => {})
                }
            }
            console.log("Error: " + error)
            console.log(error.response)
            return Promise.reject(error)
        })


    }

}