import ConstantTool from "@/service/tool/ConstantTool"
import TwitterUser from "@/model/twitter/TwitterUser"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import Response from "@/model/response/Response"
import JsonTool from "@/service/tool/JsonTool"
import axios from "axios";

export default class ProfilesService {

    static async getTwitterProfiles(page: number, size: number): Promise<Response<TwitterUser[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/profiles/twitter`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size }
            })
            const profiles = JsonTool.jsonConvert.deserializeArray(response.data, TwitterUser)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: profiles, xTotalCount})
        } catch (e) {
            return Promise.reject(e)

        }
    }

}