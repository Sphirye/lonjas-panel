import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript"
import DateTimeConverter from "@/service/tool/DateTimeConverter"
import TwitterUser from "@/model/twitter/TwitterUser"
import Auditing from "@/model/Auditing"
import {DateTime} from "luxon"

export enum Type {
    TWITTER = "TWITTER",
}

export enum Status {
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

@JsonConverter
class StatusConverter implements JsonCustomConvert<Status> {
    deserialize(data: string): Status { return (<any>Status)[data] }
    serialize(data: Status): any { return data.toString() }
}

@JsonConverter
class TypeConverter implements JsonCustomConvert<Type> {
    deserialize(data: string): Type { return (<any>Type)[data] }
    serialize(data: Type): any { return data.toString() }
}

@JsonObject("Synchro")
export default class Synchro extends Auditing {

    @JsonProperty("id", Number, true)
    id?: number = undefined

    @JsonProperty("startDate", DateTimeConverter, true)
    startDate?: DateTime = undefined

    @JsonProperty("finishDate", DateTimeConverter, true)
    finishDate?: DateTime = undefined

    @JsonProperty("status", StatusConverter, true)
    status?: Status = undefined

    @JsonProperty("type", TypeConverter, true)
    type?: Type = undefined

    @JsonProperty("twitter", TwitterUser, true)
    twitter?: TwitterUser = undefined

}