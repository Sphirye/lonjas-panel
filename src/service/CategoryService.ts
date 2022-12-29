import {Vue} from "vue-property-decorator";
import Category from "@/model/Category";
import ConstantTool from "@/service/tool/ConstantTool";
import JsonTool from "@/service/tool/JsonTool";
import axios from "axios";
import Response from "@/model/response/Response";

export default class CategoryService {

    static async getCategories2(page: number, size: number, search: string | null): Promise<Response<Category[]>> {
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
        } catch (e) {
            return Promise.resolve(e)
        }
    }

    static async getCategories(component: Vue, categories: Category[], page: number, size: number, search: string | null) {
        // @ts-ignore
        component.loading = true

        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + "/public/category", {
                params: { page, size, search }
            })

            let list = JsonTool.jsonConvert.deserializeArray(response.data, Category)
            categories.splice(0, categories.length)
            list.forEach(v => categories.push(v))
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}