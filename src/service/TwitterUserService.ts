import ConstantTool from "@/service/tool/ConstantTool"
import SessionModule from "@/store/SessionModule"
import {getModule} from "vuex-module-decorators"
import {Vue} from "vue-property-decorator"
import JsonTool from "@/service/tool/JsonTool";
import TwitterUser from "@/model/twitter/TwitterUser";

export default class TwitterUserService {

    static async registerTwitterUserByUsername(component: Vue, username: string) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.post(ConstantTool.BASE_URL + `/api/twitter/user/register/by/username/${username}`, null,{
                headers: { Authorization: getModule(SessionModule).session.token }
            })
        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

    static async getTwitterUserByUsername(component: Vue, username: string) {
        // @ts-ignore
        component.loading = true
        try {
            let response = await component.axios.get(ConstantTool.BASE_URL + `/api/twitter-api/user/by/username/${username}`, {
                headers: { Authorization: getModule(SessionModule).session.token }
            })

            // @ts-ignore
            component.twitterUser = JsonTool.jsonConvert.deserializeObject(response.data, TwitterUser)

        } catch (e) {

        } finally {
            // @ts-ignore
            component.loading = false
        }
    }

}