import {JsonObject, JsonProperty} from "json2typescript";
import {AuthorityName} from "@/model/Authority";

@JsonObject("MediaStoringResponse")
export default class MediaStoringResponse {
    @JsonProperty("totalCount", Number, true)
    totalCount?: number = undefined
    @JsonProperty("retrievedCount", Number, true)
    retrievedCount?: number = undefined
}