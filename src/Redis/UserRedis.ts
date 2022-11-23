import error from '../Error/Error_user';
import { createClient } from 'redis';
import { environmentsConfig} from '../Config/Environments';
import { ISession, IUser } from '../Interface/UserReq.Interface';
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
        return JSON.parse(responseRedis.toString());
    } catch (err) {
        return error.USER_NOT_FOUND_REDIS
    }
}

export function deleteSessionUser(token: string){
    return clienteRedis.del(token)
        .then(
            (res: number) => res,
            (rej: any) => rej
        )
    }
