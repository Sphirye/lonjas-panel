import ConstantTool from "@/service/tool/ConstantTool"
import SnackbarModule from "@/store/SnackbarModule"
import SessionModule from "@/store/SessionModule"
import Response from "@/model/response/Response"
import {getModule} from "vuex-module-decorators"
import JsonTool from "@/service/tool/JsonTool"
import Category from "@/model/Category"
import Post from "@/model/Post"
import axios from "axios"

export default class PostService {

    static async getPost(id: number): Promise<Response<Post>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/post/${id}`, {
                headers: {Authorization: getModule(SessionModule).session.token},
            })
            const post = JsonTool.jsonConvert.deserializeObject(response.data, Post)
            return Promise.resolve({result: post})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async getPosts(
        page: number, size: number, search: Nullable<string>, artistId: Nullable<number>, categoryIds: Nullable<number[]>,
        characterIds: Nullable<number[]>, tagIds: Nullable<number[]>, enabled: Nullable<boolean>
    ): Promise<Response<Category[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/post`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: {
                    page, size, enabled, artistId, search,
                    categoryIds: categoryIds?.toString(),
                    characterIds: characterIds?.toString(),
                    tagIds: tagIds?.toString()
                }
            })
            let posts = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: posts, xTotalCount})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async getPublicPosts(
        page: number, size: number, artistId: Nullable<number>, categoryIds: Nullable<number[]>,
        characterIds: Nullable<number[]>, tagIds: Nullable<number[]>
    ): Promise<Response<Category[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/public/post`, {
                params: {
                    page, size, artistId,
                    categoryIds: categoryIds?.toString(),
                    characterIds: characterIds?.toString(),
                    tagIds: tagIds?.toString()
                }
            })
            let posts = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: posts, xTotalCount})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async getPostsByArtist(id: number, page: number, size: number): Promise<Response<Post[]>> {
        try {
            const response = await axios.get(`${ConstantTool.BASE_URL}/api/artist/${id}/post`, {
                headers: {Authorization: getModule(SessionModule).session.token},
                params: {page, size}
            })
            let posts = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: posts, xTotalCount})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async createPostFromTweet(tweetId: string, tags: number[], categories: number[], characters: number[]): Promise<Response<Post>> {
        try {
            const response = await axios.post(`${ConstantTool.BASE_URL}/api/post/from/tweet/${tweetId}`, null, {
                params: {tags: tags.toString(), categories: categories.toString(), characters: characters.toString()},
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            const post = JsonTool.jsonConvert.deserializeObject(response.data, Post)
            getModule(SnackbarModule).makeToast("Post creado exitosamente.")
            return Promise.resolve({result: post})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async updatePost(id: number, request: Post): Promise<Response<Post>> {

        let formData: FormData = new FormData()
        formData.set("categories", request.categories!.toString())
        formData.set("characters", request.characters!!.toString())
        formData.set("tags", request.tags!!.toString())

        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/post/${id}`, request, {
                headers: { Authorization: getModule(SessionModule).session.token },
            })
            const post = JsonTool.jsonConvert.deserializeObject(response.data, Post)
            getModule(SnackbarModule).makeToast("Post actualizado exitosamente.")
            return Promise.resolve({result: post})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    static async setPostStatus(id: number, enabled: boolean): Promise<Response<Post>> {
        try {
            const response = await axios.patch(`${ConstantTool.BASE_URL}/api/post/${id}/status`, null, {
                headers: {Authorization: getModule(SessionModule).session.token},
                params: { enabled }
            })
            const post = JsonTool.jsonConvert.deserializeObject(response.data, Post)
            return Promise.resolve({ result: post })
        } catch (e) {
            return Promise.reject(e)
        }
    }

}