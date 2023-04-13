import { JsonObject, JsonProperty, Any } from 'json2typescript'
import Auditing from "@/model/Auditing"

@JsonObject("User")
export default class User extends Auditing {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("email", String, true)
    email?: string = undefined

    @JsonProperty("username", String, true)
    username?: string = undefined

    @JsonProperty("enabled", Boolean, true)
    enabled?: boolean = undefined

}