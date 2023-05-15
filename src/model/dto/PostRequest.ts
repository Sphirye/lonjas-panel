import Character from "@/model/Character"
import Category from "@/model/Category"
import Tag from "@/model/Tag"

export default class PostRequest {

    categories?: Category[] = undefined
    characters?: Character[] = undefined
    tags?: Tag[] = undefined

}