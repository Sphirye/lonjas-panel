import {AuthorityName} from "@/model/Authority";

export default class DrawerItem {
    title?: string = undefined
    icon?: string = undefined
    subheader?: string = undefined
    to?: string = undefined             // Route target
    global?: boolean = false            // The item will be showed for everyone
    allowed?: AuthorityName[] = []      // The item will be showed to these roles when global is false
}