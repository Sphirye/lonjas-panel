import LangModule from "@/store/LangModule";
import {getModule} from "vuex-module-decorators";

let langModule: LangModule = getModule(LangModule)

export default {
    required: (input: string) => (input ? true : langModule.lang.requiredField),
    required2: (input: string) => (!!input || langModule.lang.requiredField),
    email: (input: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input) || langModule.lang.invalidEmail),
    minLength: (minLength: number) => (input: string) => (!!input && input.length >= minLength || `Input must be at least ${minLength} characters`),
    noSpaces: (input: string) => (!/\s/.test(input) || `Input cannot contain spaces`)
}