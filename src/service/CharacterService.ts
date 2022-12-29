import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Character from "@/model/Character"
import axios from "axios";
import Response from "@/model/response/Response";

export default class CharacterService {

    static async getCharacters2(page: number, size: number, search: string | null): Promise<Response<Character[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/public/character", {
                params: { page, size, search }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async getCharacters(component: Vue, characters: Character[], page: number, size: number, search: string | null) {
        // @ts-ignore
        component.loading = true

        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + "/public/character", {
                params: { page, size, search }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            characters.splice(0, characters.length)
            list.forEach(v => characters.push(v))
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }
}