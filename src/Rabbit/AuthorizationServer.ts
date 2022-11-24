import { invalidateToken } from "../Token/Token"
import { logoutSessionRabbit } from "./ReceiveRabbit/Receive"

export async function logoutSession(){
    const logout = {
        exchange: "auth"
    }
    await logoutSessionRabbit(logout, invalidateToken)
}