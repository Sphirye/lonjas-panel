import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Character from "@/model/Character"

export default class CharacterService {
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