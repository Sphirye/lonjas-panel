import {JsonObject, JsonProperty} from "json2typescript"
import User from "@/model/User"

@JsonObject("LoginResponse")
export default class LoginResponse {

    @JsonProperty("user", User, true)
    user?: User = undefined

    @JsonProperty("token", String, true)
    token?: string = undefined

}