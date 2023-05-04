import ConstantTool from "@/service/tool/ConstantTool"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Tweet from "@/model/twitter/Tweet"
import axios from "axios";
import Response from "@/model/response/Response";
import SnackbarModule from "@/store/SnackbarModule";
import MediaStoringResponse from "@/model/dto/MediaStoringResponse";

export default class TweetService {

    static async getTweet2(id: string): Promise<Response<Tweet>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + `/api/twitter/tweet/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const tweet = JsonTool.jsonConvert.deserializeObject(response.data, Tweet)
            return Promise.resolve({ result: tweet })
        } catch (e) { return Promise.reject(e) }
    }

    static async getTweet(component: Vue, id: String) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + `/api/twitter/tweet/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            // @ts-ignore
            component.tweet = JsonTool.jsonConvert.deserializeObject(response.data, Tweet)
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async findTweetsByTwitterUser(page: number, size: number, search: Nullable<string>, twitterUserId: string) {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + `/api/twitter/${twitterUserId}/tweet`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search }
            })
            const tweets = JsonTool.jsonConvert.deserializeArray(response.data, Tweet)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: tweets, xTotalCount})
        } catch (e) { return Promise.reject(e) }
    }

    static async findArtistTweets2(page: number, size: number, search: Nullable<string>, artistId: number): Promise<Response<Tweet[]>> {
        try {
            const response = await axios.get(ConstantTool.BASE_URL + `/api/artist/${artistId}/tweets`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search }
            })
            const tweets = JsonTool.jsonConvert.deserializeArray(response.data, Tweet)
            const xTotalCount = Number(response.headers["x-total-count"])
            return Promise.resolve({result: tweets, xTotalCount})
        } catch (e) { return Promise.reject(e) }
    }

    static async findArtistTweets(component: Vue, tweets: Tweet[], page: number, size: number, search: string, artistId: number) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + `/api/artist/${artistId}/tweets`, {
                headers: { Authorization: getModule(SessionModule).session.token },
                params: { page, size, search }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Tweet)
            tweets.splice(0, tweets.length)
            list.forEach(v => tweets.push(v))
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async syncUserTweets(component: Vue, twitterUserId: string) {
        try {
            let response = await component.axios.patch(ConstantTool.BASE_URL + `/api/twitter/user/${twitterUserId}/tweet/sync`, null, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            getModule(SnackbarModule).makeToast(`La sincronización ha empezado, el estado puede consultarse en la vista de sincronizaciones.`)
        } catch (e) { return Promise.reject(e) }
    }

    static async storeMediaTweets(twitterUserId: string) {
        try {
            let response = await axios.patch(ConstantTool.BASE_URL + `/api/twitter/user/${twitterUserId}/store`, null, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
            const mediaRetrievingData = JsonTool.jsonConvert.deserializeObject(response.data, MediaStoringResponse)
            getModule(SnackbarModule).makeToast(`Se guardaron ${mediaRetrievingData.retrievedCount} archivos nuevos, habiendo ahora un total de ${mediaRetrievingData.totalCount} archivos.`)
        } catch (e) { return Promise.reject(e) }
    }

    static async deleteTweet(component: Vue, id: string) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.delete(ConstantTool.BASE_URL + `/api/twitter/tweet/${id}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })
        } catch (e) {
            console.log(e)
        } finally {
            // @ts-ignore
            component.loading = false
        }
    }
}