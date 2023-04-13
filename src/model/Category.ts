import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("Category")
export default class Category {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("name", String, true)
    name?: string = undefined

    @JsonProperty("enabled", Boolean, true)
    enabled?: boolean = undefined

}