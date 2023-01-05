import ConstantTool from "@/service/tool/ConstantTool"
import Response from "@/model/response/Response"
import {getModule} from "vuex-module-decorators"
import SessionModule from "@/store/SessionModule"
import JsonTool from "@/service/tool/JsonTool"
import Category from "@/model/Category"
import axios from "axios"

export default class CategoryService {

    static async createCategories(name: string): Promise<Category> {
        try {
            const response = await axios.post(ConstantTool.BASE_URL + "/api/category", null, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { name }
            })
            const category = JsonTool.jsonConvert.deserializeObject(response.data, Category)
            return Promise.resolve(category)
        } catch (e) { return Promise.resolve(e) }
    }

    static async getPublicCategories(page: number, size: number, search: string | null): Promise<Response<Category[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/public/category", {
                params: { page, size, search }
            })

            let categories = JsonTool.jsonConvert.deserializeArray(response.data, Category)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({
                result: categories,
                xTotalCount
            })
        } catch (e) { return Promise.resolve(e) }
    }

    static async getCategories(page: number, size: number, search: string | null, active: boolean | null): Promise<Response<Category[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/category", {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search, active }
            })

            let categories = JsonTool.jsonConvert.deserializeArray(response.data, Category)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({
                result: categories,
                xTotalCount
            })
        } catch (e) {
            return Promise.resolve(e)
        }
    }

}