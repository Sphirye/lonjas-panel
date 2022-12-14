import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Artist from "@/model/Artist"

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

    static async getArtists(component: Vue, artists: Artist[], page: number, size: number, search: string) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/artist`, {
                params: { page, size, search }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Artist)
            artists.splice(0, artists.length)
            list.forEach(v => artists.push(v))

        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}