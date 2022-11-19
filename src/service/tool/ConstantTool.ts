import { config } from "dotenv"
config()
export default class ConstantTool {

    static readonly BASE_URL = process.env.VUE_APP_BASE_URL
    static readonly ENCRYPT_SESSION: boolean = process.env.VUE_APP_ENCRYPT_SESSION === "true"

}