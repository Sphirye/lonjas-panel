import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"
import store from "@/store/index"
import Dialog from "@/model/vue/Dialog"

@Module({dynamic: true, store, name: "DialogModule"})
export default class DialogModule extends VuexModule {

    enabled: boolean = false
    title: string = "No message"
    body: string = "No body"
    callback: any

    @Mutation
    setDialogEnabled(enabled: boolean) {
        this.enabled = enabled
    }

    @Mutation
    setDialogTitle(title: string) {
        this.title = title
    }

    @Mutation
    setDialogBody(body: string) {
        this.body = body
    }

    @Action
    showDialog(dialog: Dialog) {
        this.setDialogEnabled(true)
        this.setDialogTitle(dialog.title!)
        this.setDialogBody(dialog.body!)
        this.callback = dialog.callback
    }

}