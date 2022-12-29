import {Vue} from "vue-property-decorator";
import ConstantTool from "@/service/tool/ConstantTool";
import JsonTool from "@/service/tool/JsonTool";
import Post from "@/model/Post";
import Tag from "@/model/Tag";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import Response from "@/model/response/Response";
import {Any} from "json2typescript";
import axios from "axios/index";

export default class TagService {

    static async getTags2(page: number, size: number, search: string | null): Promise<Response<Tag[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/public/tag`, {
                params: { page, size, search }
            })
            const tags = JsonTool.jsonConvert.deserializeArray(response.data, Tag)
            const xTotalCount = Number(response.headers["x-total-count"])

            return Promise.resolve({
                result: tags,
                xTotalCount
            })
        } catch (e) {
            return Promise.reject(e)
        }

    }

    static async getTag(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/api/tag/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            // @ts-ignore
            component.tag = JsonTool.jsonConvert.deserializeObject(response.data, Tag)
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }
    static async getPublicTags(component: Vue, tags: Tag[], page: number, size: number, search: string | null) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/tag`, {
                params: { page, size, search }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Tag)
            tags.splice(0, tags.length)
            list.forEach(v => tags.push(v))
            // @ts-ignore
            component.totalPosts = Number(response.headers["x-total-count"])
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async getTags(component: Vue, tags: Tag[], page: number, size: number, search: string | null, enabled: boolean | null) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/api/tag`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search, enabled }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Tag)
            tags.splice(0, tags.length)
            list.forEach(v => tags.push(v))
            // @ts-ignore
            component.totalPosts = Number(response.headers["x-total-count"])
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async createTag(component: Vue, name: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("name", name)

        try {
            const response = await component.axios.post(`${ConstantTool.BASE_URL}/api/tag`, formData, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async deleteTag(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.delete(`${ConstantTool.BASE_URL}/api/tag/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}