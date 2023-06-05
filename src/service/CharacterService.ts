import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import Character, {Gender} from "@/model/Character"
import Response from "@/model/response/Response"
import {getModule} from "vuex-module-decorators"
import SessionModule from "@/store/SessionModule"
import axios from "axios"
import Post from "@/model/Post";

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

    static async getCharacters(page: number, size: number, search: Nullable<string>, enabled: Nullable<boolean>): Promise<Response<Character[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/character", {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search, enabled }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async getCategoryCharacters(page: number, size: number, search: string | null, id: number) {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/category/" + id + "/character", {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async getPublicCategoryCharacters(page: number, size: number, search: string | null, id: number) {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/public/category/" + id + "/character", {
                params: { page, size, search }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async getPublicCharacters(page: number, size: number, search: string | null): Promise<Response<Character[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/public/character", {
                params: { page, size, search }
            })
            const characters = JsonTool.jsonConvert.deserializeArray(response.data, Character)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: characters, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async createCharacter(name: string, categoryId: number, gender: Gender): Promise<Response<Character>> {
        try {
            const response = await axios.post(ConstantTool.BASE_URL + "/api/character", null, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { name, categoryId, gender },
            })
            const character = JsonTool.jsonConvert.deserializeObject(response.data, Character)
            return Promise.resolve({ result: character })
        } catch (e) { return Promise.reject(e) }
    }

    static async updateCharacter(id: number, request: Character): Promise<Response<Character>> {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/character/${id}`, request, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const character = JsonTool.jsonConvert.deserializeObject(response.data, Character)
            return Promise.resolve({ result: character })
        } catch (e) { return Promise.reject(e) }
    }

    static async setCharacterStatus(id: number, enabled: boolean): Promise<Response<Character>> {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/character/${id}/status`, null, {
                headers: {Authorization: getModule(SessionModule).session.token},
                params: { enabled }
            })
            const character = JsonTool.jsonConvert.deserializeObject(response.data, Character)
            return Promise.resolve({ result: character })
        } catch (e) { return Promise.reject(e) }
    }

}