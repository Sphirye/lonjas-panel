import {Any, JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript"
import TwitterUser from "@/model/twitter/TwitterUser"

export enum Source {
    TWITTER = "TWITTER",
    DEVIANTART = "DEVIANTART"
}

@JsonConverter
class SourceConverter implements JsonCustomConvert<Source> {
    deserialize(data: string): Source { return (<any>Source)[data] }
    serialize(data: Source): any { return data.toString() }
}


@JsonObject("Artist")
export default class Artist {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("twitter", Any, false)
    twitter?: TwitterUser = undefined

    @JsonProperty("source", SourceConverter, true)
    source?: Source = undefined

    @JsonProperty("enabled", Boolean, true)
    enabled?: boolean = undefined

}