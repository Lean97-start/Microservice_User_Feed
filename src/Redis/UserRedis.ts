import error from '../Error/Error_user';
import { createClient } from 'redis';
import { environmentsConfig} from '../Config/Environments';
import { IUser } from '../Interface/UserReq.Interface';
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

export function setUser(token: string, userData: IUser){
    return clienteRedis.set(`${token}`, JSON.stringify(userData))
    .then(
        () => true,
        () => false
    )
}

export function getUser(token: string){
    return clienteRedis.get(`${token}`)
    .then(
        (res: IUser) => {return {token, user: res}},
        (rej: Error) => {return error.USER_NOT_FOUND_REDIS}
    )
}

export function deleteSessionUser(token: string){
    return clienteRedis.del(token)
        .then(
            (res: number) => res,
            (rej: any) => rej
        )
    }
