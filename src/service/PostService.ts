import ConstantTool from "@/service/tool/ConstantTool"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Post from "@/model/Post"

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

    static async getPosts(component: Vue, posts: Post[], page: number, size: number, categoryId: number | null, characterIds: number[] | null, tagIds: number[] | null) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/post`, {
                params: {
                    page: page, size: size, categoryId,
                    characterIds: characterIds ? characterIds.toString() : null,
                    tagIds: tagIds ? tagIds.toString() : null
                }
            })

            let list = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            posts.splice(0, posts.length)
            list.forEach(v => posts.push(v))
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async getPostsByArtist(component: Vue, posts: Post[], id: number, page: number, size: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(`${ConstantTool.BASE_URL}/public/artist/${id}/post`, {
                params: { page, size }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Post)
            posts.splice(0, posts.length)
            list.forEach(v => posts.push(v))
            // @ts-ignore
            component.totalPosts = Number(response.headers["x-total-count"])
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async createPostFromTweet(component: Vue, artistId: number, tweetId: string) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.post(`${ConstantTool.BASE_URL}/api/artist/${artistId}/post`, null, {
                params: { tweetId }
            })
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}