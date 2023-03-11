import {AuthorityName} from "@/model/Authority"
import {getModule} from "vuex-module-decorators"
import DrawerItem from "@/model/vue/DrawerItem"
import LangModule from "@/store/LangModule"

let lang = getModule(LangModule).lang

let drawerList: DrawerItem[] = [

    { title: lang.home, to: "/", icon: "mdi-home", global: true },

    { title: "Artistas", to: "/artists", global: true },
    { title: "Tags", to: "/tags", global: true },
    { title: "Categorías", to: "/categories", global: true },
    { title: "Personajes", to: "/characters", global: true },
    { title: "Posts", to: "/posts", global: true },
    { title: "Perfiles", to: "/profiles", global: true },

    { subheader: "Configuración", allowed: [ AuthorityName.SUPER_ADMIN, AuthorityName.ADMIN ]},
    { title: "Usuarios", to: "/users", allowed: [ AuthorityName.SUPER_ADMIN, AuthorityName.ADMIN ] },
    { title: "Historial", to: "/users", allowed: [ AuthorityName.SUPER_ADMIN, AuthorityName.ADMIN ] },

]

export default drawerList