import {JsonObject, JsonProperty} from "json2typescript";
import TwitterUser from "@/model/twitter/TwitterUser";

@JsonObject("Artist")
export default class Artist {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("twitter", TwitterUser, true)
    twitter?: TwitterUser = undefined

}