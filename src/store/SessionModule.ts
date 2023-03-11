import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators"
import ConstantTool from "@/service/tool/ConstantTool"
import CryptoTool from "@/service/tool/CryptoTool"
import Session from "@/model/Session"
import store from "@/store/index"

@Module({dynamic: true, store, name: "SessionModule"})
export default class SessionModule extends VuexModule {

    session: Session = new Session()

    @Mutation
    setSession(session: Session) { this.session = session }

    @Action
    saveSession() {
        try {
            if (ConstantTool.ENCRYPT_SESSION) {
                localStorage.setItem(Session.KEY, CryptoTool.encrypt(JSON.stringify(this.session)))
            } else {
                localStorage.setItem(Session.KEY, JSON.stringify(this.session))
            }
        } catch (e) {
            console.log("Error on saving session...")
            localStorage.removeItem(Session.KEY)
            this.setSession(new Session())
        }
    }

    @Action
    loadSession() {
        try {
            let sessionObject = localStorage.getItem(Session.KEY)
            if (sessionObject != null) {
                if (ConstantTool.ENCRYPT_SESSION) {
                    this.setSession(JSON.parse(CryptoTool.decrypt(sessionObject)))
                } else {
                    this.setSession(JSON.parse(sessionObject))
                }
            } else {
                this.setSession(new Session())
            }
        } catch (e) {
            console.log("Error on loading session...")
            localStorage.removeItem(Session.KEY)
            this.setSession(new Session())
        }
    }

    @Action
    destroySession() {
        this.setSession(new Session())
        this.saveSession()
    }

}