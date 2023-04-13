import {JsonObject, JsonProperty} from "json2typescript"
import Authority from "@/model/Authority"
import User from "@/model/User"

@JsonObject("LoginResponse")
export default class LoginResponse {

    @JsonProperty("user", User, true)
    user?: User = undefined

    @JsonProperty("token", String, true)
    token?: string = undefined

    @JsonProperty("authorities", [Authority], true)
    authorities?: Authority[] = undefined

}