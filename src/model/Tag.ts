import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("Tag")
export default class Tag {
    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("name", String, true)
    name?: string = undefined
}