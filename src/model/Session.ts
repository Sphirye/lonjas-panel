import User from "@/model/User";
import Authority from "@/model/Authority";

export default class Session {
    static readonly KEY = "Session"
    token!: string
    user!: User
    authorities!: Authority[]
}