import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";

export enum AuthorityName {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MOD = "MOD",
}

@JsonConverter
class NameConverter implements JsonCustomConvert<AuthorityName> {
    deserialize(data: string): AuthorityName { return (<any>AuthorityName)[data] }
    serialize(data: AuthorityName): any { return data.toString() }
}

@JsonObject("Authority")
export default class Authority {
    @JsonProperty("role", NameConverter, true)
    name?: AuthorityName = undefined
}

