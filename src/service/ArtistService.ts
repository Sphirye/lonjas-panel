import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Artist from "@/model/Artist"
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import axios from "axios";
import Response from "@/model/response/Response";

export default class ArtistService {

    static async getArtist(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/artist/` + id)
            // @ts-ignore
            component.artist = JsonTool.jsonConvert.deserializeObject(response.data, Artist)
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async getArtists(page: number, size: number, search: string | null): Promise<Response<Artist[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/public/artist`, {
                params: { page, size, search }
            })
            let artists = JsonTool.jsonConvert.deserializeArray(response.data, Artist)
            const xTotalCount = Number(response.headers["x-total-count"])

            return Promise.resolve({
                result: artists,
                xTotalCount
            })
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async createFromTwitter(component: Vue, twitterId: string) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.post(ConstantTool.BASE_URL + `/api/artist/create/twitter`, null,{
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { twitterId }
            })
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}