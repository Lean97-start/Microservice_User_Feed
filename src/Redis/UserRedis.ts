import error from '../Error/Error_user';
import { createClient } from 'redis';
import { environmentsConfig} from '../Config/Environments';
// import { ISession, IUser } from '../Interface/UserReq.Interface';
const redisEnv = environmentsConfig();

let clienteRedis: any;

export function redisInit(){
    //Creo la instancia de Redis.
    clienteRedis = createClient({
        url: redisEnv.redisUrl
    });
    
    //Connectamos a redis
    clienteRedis.connect()
    .then(
        () => console.log("Redis connected"),
        () => console.log("Redis failed")
    )
}

export async function setUser(token: string, userData: any){
    return await clienteRedis.set(`${token}`, JSON.stringify(userData))
    .then(() => true, () => false)
}

export async function getUser(token: string){
    try {
        let responseRedis = await clienteRedis.get(`${token}`)
        if(responseRedis) return JSON.parse(responseRedis.toString());
        return null
    } catch (err) {
        throw error.USER_NOT_FOUND_REDIS
    }   
}

export function deleteSessionUser(token: string){
    return clienteRedis.del(token)
        .then(
            (res: number) => {return res},
            (rej: any) => {return rej}
        )
    }
