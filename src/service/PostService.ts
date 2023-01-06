import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Post from "@/model/Post"
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import SnackbarModule from "@/store/SnackbarModule";
import axios from "axios";
import Response from "@/model/response/Response";
import Tag from "@/model/Tag";
import Artist from "@/model/Artist";
import Category from "@/model/Category";

export default class PostService {

    static async getPost(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/post/${id}`)
            // @ts-ignore
            component.post = JsonTool.jsonConvert.deserializeObject(response.data, Post)
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async getPosts(
        page: number, size: number, artistId: Nullable<number>, categoryIds: Nullable<number[]>,
        characterIds: Nullable<number[]>, tagIds: Nullable<number[]>, enabled: Nullable<boolean>
    ): Promise<Response<Category[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/post`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: {
                    page, size, enabled, artistId,
                    categoryIds: categoryIds?.toString(),
                    characterIds: characterIds?.toString(),
                    tagIds: tagIds?.toString()
                }})
            let posts = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: posts, xTotalCount })
        } catch (e) { return Promise.reject(e) }
    }

    static async getPostsByArtist(id: number, page: number, size: number): Promise<Response<Post[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/artist/${id}/post`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size }
            })
            let posts = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({ result: posts, xTotalCount })
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async createPostFromTweet(component: Vue, artistId: string, tweetId: string, tags: number[], categories: number[], characters: number[]) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("tweetId", tweetId)
        formData.set("tags", tags.toString())
        formData.set("categories", categories.toString())
        formData.set("characters", characters.toString())

        try {
            const response = await component.axios.post(`${ConstantTool.BASE_URL}/api/artist/${artistId}/post/tweet`, formData, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            getModule(SnackbarModule).makeToast("Post creado exitosamente.")
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async patchPost(id: number, request: Post) {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/post/${id}`, request, {
                headers: { Authorization: getModule(SessionModule).session.token },
            })
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async deletePost(id: number) {
        try {
             const response = await axios.delete(`${ConstantTool.BASE_URL}/api/post/${id}`, {
                 headers: { Authorization: getModule(SessionModule).session.token },
             })
        } catch (e) {
            return Promise.reject(e)
        }
    }

}