export default class Language {

    static readonly KEY = "lang"
    name!: string
    value!: LanguageType
    file!: any

}

export enum LanguageType {
    SPANISH = "SPANISH",
    ENGLISH = "ENGLISH"
}
