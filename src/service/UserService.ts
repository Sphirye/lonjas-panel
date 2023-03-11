import axios from "axios";
import ConstantTool from "@/service/tool/ConstantTool"
import {getModule} from "vuex-module-decorators"
import SessionModule from "@/store/SessionModule"
import Authority, {AuthorityName} from "@/model/Authority"
import JsonTool from "@/service/tool/JsonTool"
import User from "@/model/User"
import UserRequest from "@/model/dto/UserRequest";
import response from "@/model/response/Response";
import Response from "@/model/response/Response";

export default class UserService {

    static async getUsers(page: number, size: number, search: Nullable<string>, role: Nullable<AuthorityName>): Promise<Response<User[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + "/api/user", {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search, role }
            })
            const users = JsonTool.jsonConvert.deserializeArray(response.data, User)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: users, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async postAdminUser(userRequest: UserRequest): Promise<response<User>> {
        try {
            const response = await axios.post(ConstantTool.BASE_URL + "/api/user/admin", userRequest, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const users = JsonTool.jsonConvert.deserializeObject(response.data, User)
            return Promise.resolve({ result: users })
        } catch (e) { return Promise.reject(e) }
    }

}