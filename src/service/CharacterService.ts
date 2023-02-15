import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Character from "@/model/Character"
import axios from "axios";
import Response from "@/model/response/Response";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";

export default class CharacterService {

    static async getCharacter(id: number): Promise<Response<Character>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/character/" + id, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const characters = JsonTool.jsonConvert.deserializeObject(response.data, Character)
            return Promise.resolve({ result: characters })
        } catch (e) { return Promise.reject(e) }
    }

    static async getCharacters2(page: number, size: number, search: string | null): Promise<Response<Character[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/public/character", {
                params: { page, size, search }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async createCharacter(name: string, categoryId: number) {
        try {
            const response = await axios.post(ConstantTool.BASE_URL + "/api/character", null, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { name, categoryId },
            })
        } catch (e) {
            return Promise.reject(e)
        }
    }

}