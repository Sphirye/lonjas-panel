import ConstantTool from "@/service/tool/ConstantTool"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import JsonTool from "@/service/tool/JsonTool"
import {Vue} from "vue-property-decorator"
import Tweet from "@/model/twitter/Tweet"

export default class TweetService {

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
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.patch(ConstantTool.BASE_URL + `/api/twitter/user/${twitterUserId}/tweet/sync`, null, {
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