import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript"
import Character, {Gender} from "@/model/Character"
import Category from "@/model/Category"
import Artist from "@/model/Artist"
import Tag from "@/model/Tag"
import Tweet from "@/model/twitter/Tweet";

export enum Type {
    TWEET = "TWEET",
}

@JsonConverter
class TypeConverter implements JsonCustomConvert<Type> {

    deserialize(data: string): Type {
        return (<any>Type)[data]
    }
    serialize(data: Type): any {
        return data.toString()
    }

}

@JsonObject("Post")
export default class Post {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("artist", Artist, true)
    artist?: Artist = undefined

    @JsonProperty("tags", [Tag], true)
    tags?: Tag[] = undefined

    @JsonProperty("categories", [Category], true)
    categories?: Category[] = undefined

    @JsonProperty("characters", [Character], true)
    characters?: Character[] = undefined

    @JsonProperty("approved", Boolean, true)
    approved?: boolean = undefined

    @JsonProperty("tweet", Tweet, true)
    tweet?: Tweet = undefined

    @JsonProperty("type", TypeConverter, true)
    type?: Type = undefined

}