import User from "@/model/User";

export default class Session {
    static readonly KEY = "Session"
    token!: string
    user!: User
    // authorities!: Authority[]
}