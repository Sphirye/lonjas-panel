import {JsonObject, JsonProperty} from "json2typescript"
import Auditing from "@/model/Auditing";

@JsonObject("TwitterUser")
export default class TwitterUser extends Auditing {

    @JsonProperty("id", String, true)
    id?: string = undefined

    @JsonProperty("name", String, true)
    name?: string = undefined

    @JsonProperty("username", String, true)
    username?: string = undefined

    @JsonProperty("description", String, true)
    description?: string = undefined

    @JsonProperty("profileImageUrl", String, true)
    profileImageUrl?: string = undefined

}