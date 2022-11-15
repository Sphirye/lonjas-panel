import VueAxios from "vue-axios"
import axios, { AxiosError } from "axios"
import {Vue} from "vue-property-decorator"

export default class AxiosConfig {

    static init(vue: Vue) {

        Vue.use(VueAxios, axios)

        // axios.defaults.baseURL = ConstantTool.BASE_URL
        axios.interceptors.request.use(request => {
            console.log('Request:', request)
            return request
        })

        axios.interceptors.response.use(response => {
            console.log('Response:', response)
            return response
        }, (error: AxiosError) => {
            if (error.response && error.response.status == 401) { // TODO implement token refreshing

            }
            console.log("Error: " + error)
            console.log(error.response)
            return Promise.reject(error)
        })


    }

}