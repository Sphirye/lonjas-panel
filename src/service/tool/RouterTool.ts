import {Vue} from "vue-property-decorator"
import Tab from "@/model/vue/Tab";

export default class RouterTool {

    static configTabs(component: Vue, tabs: Tab[]): number {
        let result: number = 0
        tabs.forEach((tab, index) => {
            if (component.$route.path.includes(tab.route!)) { result = index }
        })
        return result
    }

    static watchTabs(component: Vue, endpoint: string, tab: number, tabs: Tab[]) {
        let path: string = endpoint
        path += tabs[tab].route
        component.$router.push(path).catch(error => {})
    }

}
