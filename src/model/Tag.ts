import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("Tag")
export default class Tag {
    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("name", String, true)
    name?: string = undefined

    @JsonProperty("description", String, true)
    description?: string = undefined

    @JsonProperty("nsfw", Boolean, true)
    nsfw?: boolean = undefined

    @JsonProperty("weirdMaterial", Boolean, true)
    weirdMaterial?: boolean = undefined

    @JsonProperty("enabled", Boolean, true)
    enabled?: boolean = undefined
}