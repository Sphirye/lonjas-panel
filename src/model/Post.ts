import {JsonObject, JsonProperty} from "json2typescript"
import Character from "@/model/Character"
import Category from "@/model/Category"
import Artist from "@/model/Artist"
import Tag from "@/model/Tag"
import Tweet from "@/model/twitter/Tweet";

@JsonObject("Post")
export default class Post {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("artist", Artist, true)
    artist?: Artist = undefined

    @JsonProperty("tags", [Tag], true)
    tags?: Tag[] = undefined

    @JsonProperty("category", Category, true)
    category?: Category = undefined

    @JsonProperty("characters", [Character], true)
    characters?: Character[] = undefined

    @JsonProperty("approved", Boolean, true)
    approved?: boolean = undefined

    @JsonProperty("tweet", Tweet, true)
    tweet?: Tweet = undefined
}