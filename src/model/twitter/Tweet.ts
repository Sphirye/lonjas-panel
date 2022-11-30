import {JsonObject, JsonProperty} from "json2typescript"
import TwitterUser from "@/model/twitter/TwitterUser"

@JsonObject("Tweet")
export default class Tweet {

    @JsonProperty("id", String, true)
    id?: string = undefined

    @JsonProperty("text", String, true)
    text?: string = undefined

    @JsonProperty("author", TwitterUser, true)
    author?: TwitterUser = undefined

    @JsonProperty("images", [String], true)
    images?: string[] = undefined

    @JsonProperty("videos", [String], true)
    videos?: string[] = undefined

}