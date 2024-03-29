import ConstantTool from "@/service/tool/ConstantTool"
import SessionModule from "@/store/SessionModule"
import Response from "@/model/response/Response"
import {getModule} from "vuex-module-decorators"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import axios from "axios/index"
import Tag from "@/model/Tag"
import SnackbarModule from "@/store/SnackbarModule";

export default class TagService {
    static async getTags(page: number, size: number, search: Nullable<string>, enabled: Nullable<boolean>, nsfw: Nullable<boolean>): Promise<Response<Tag[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/tag`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search, nsfw }
            })
            const tags = JsonTool.jsonConvert.deserializeArray(response.data, Tag)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: tags, xTotalCount})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async getTag(component: Vue, id: number): Promise<Response<Tag>> {
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/api/tag/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const tag = JsonTool.jsonConvert.deserializeObject(response.data, Tag)
            return Promise.resolve({ result: tag })
        } catch (e) { return Promise.reject(e) }
    }
    static async createTag(request: Tag): Promise<Response<Tag>> {
        try {
            const response = await axios.post(`${ConstantTool.BASE_URL}/api/tag`, request, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const tag = JsonTool.jsonConvert.deserializeObject(response.data, Tag)
            return Promise.resolve({ result: tag })
        } catch (e) { return Promise.reject(e) }
    }

    static async updateTag(id: number, request: Tag): Promise<Response<Tag>> {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/tag/${id}`, request, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const tag = JsonTool.jsonConvert.deserializeObject(response.data, Tag)
            return Promise.resolve({ result: tag })
        } catch (e) { return Promise.reject(e) }
    }

    static async setStatus(id: number, enabled: boolean): Promise<Response<Tag>> {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/tag/${id}/status`, null, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { enabled }
            })
            const tag = JsonTool.jsonConvert.deserializeObject(response.data, Tag)
            return Promise.resolve({ result: tag })
        } catch (e) { return Promise.reject(e) }
    }

    static async deleteTag(component: Vue, id: number) {
        try {
            const response = await component.axios.delete(`${ConstantTool.BASE_URL}/api/tag/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })

            if (response.data == "ENTITY_DELETED") {
                getModule(SnackbarModule).makeToast("Tag eliminado exitosamente.")
            }

            if (response.data == "ENTITY_DISABLED") {
                getModule(SnackbarModule).makeToast("Habían posts usando el tag, así que este fue deshabilitado.")
            }

        } catch (e) { return Promise.reject(e) }
    }
}