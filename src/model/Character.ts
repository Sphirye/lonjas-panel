import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";
import Category from "@/model/Category"

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

@JsonConverter
class GenderConverter implements JsonCustomConvert<Gender> {

    deserialize(data: string): Gender {
        return (<any>Gender)[data]
    }
    serialize(data: Gender): any {
        return data.toString()
    }

}

@JsonObject("Character")
export default class Character {

    @JsonProperty("category", Category, true)
    category?: Category = undefined

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("name", String, true)
    name?: string = undefined

    @JsonProperty("gender", GenderConverter, true)
    gender: Gender | null = null

    @JsonProperty("enabled", Boolean, true)
    enabled?: boolean = undefined

}