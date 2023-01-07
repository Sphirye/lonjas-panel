import LoadingUI from "@/handlers/interfaces/LoadingUI";
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI";
import LogDisplayError from "@/config/errors/LogDisplayError";
import Response from "@/model/response/Response";

export default class Handler {

    static async getItem<T>(component: LoadingUI, content: SingleItem<T>, service: () => Promise<Response<T>>) {
        try {
            if (!("item" in content)) { throw new LogDisplayError(LogDisplayError.PROPERTY_DOES_NOT_EXISTS_IN_CONTENT) }
            component.loading = true
            if ("progress" in component) { component.progress = true }
            const response = await service()
            content.item = response.result
        } catch (e) {
            console.log(e)
        } finally {
            component.loading = false
            if ("progress" in component) { component.progress = false }
        }
    }

    static async getItems<T>(component: LoadingUI, content: MultipleItem<T>, service: () => Promise<Response<T[]>>) {
        try {
            if (!("items" in content)) { throw new LogDisplayError(LogDisplayError.PROPERTY_DOES_NOT_EXISTS_IN_CONTENT) }
            component.loading = true
            if ("progress" in component) { component.progress = true }
            const response = await service()
            content.items.splice(0, content.items.length)
            content.items.push(...response.result)
            if ("totalItems" in content) { content.totalItems = response.xTotalCount }

        } catch (err: unknown) {
            console.log("Error lmao")

        } finally {

            component.loading = false
            if ("progress" in component) { component.progress = false }
        }
    }

}