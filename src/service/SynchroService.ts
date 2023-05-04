import ConstantTool from "@/service/tool/ConstantTool"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import Response from "@/model/response/Response"
import JsonTool from "@/service/tool/JsonTool"
import Synchro, {Type} from "@/model/Synchro"
import axios from "axios"

export default class SynchroService {

    static async findSynchros(page: number, size: number, search: Nullable<string>, type: Nullable<Type>): Promise<Response<Synchro[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/synchro", {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search }
            })
            const synchros = JsonTool.jsonConvert.deserializeArray(response.data, Synchro)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: synchros, xTotalCount })
        } catch (e) { return Promise.reject() }
    }

}