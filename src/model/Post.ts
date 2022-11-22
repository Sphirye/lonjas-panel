import {JsonObject, JsonProperty} from "json2typescript"
import Character from "@/model/Character"
import Category from "@/model/Category"
import Artist from "@/model/Artist"
import Tag from "@/model/Tag"

@JsonObject("Post")
export default class Post {

    @JsonProperty("id", String, true)
    id?: string = undefined

    @JsonProperty("artist", Artist, true)
    artist?: Artist = undefined

    @JsonProperty("tags", [Tag], true)
    tags?: Tag[] = undefined

    @JsonProperty("category", Category, true)
    category?: Category = undefined

    @JsonProperty("characters", [Character], true)
    characters?: Character[] = undefined

    @JsonProperty("images", [String], true)
    images?: string[] = undefined

    @JsonProperty("description", String, true)
    description?: string = undefined

    @JsonProperty("approved", Boolean, true)
    approved?: boolean = undefined

}