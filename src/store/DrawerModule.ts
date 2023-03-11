import {Module, Mutation, VuexModule} from "vuex-module-decorators"
import store from "@/store"
import DrawerItem from "@/model/vue/DrawerItem";

@Module({dynamic: true, store, name: "DrawerModule"})
export default class DrawerModule extends VuexModule{

    drawer: boolean = false

    @Mutation
    toggle(){
        this.drawer = !this.drawer
    }

    @Mutation
    setDrawer(drawer:boolean){
        this.drawer = drawer
    }
}