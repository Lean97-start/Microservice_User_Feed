import { environmentsConfig } from "../Config/Environments";
import axios from 'axios';
import Error_token from "../Error/Error_token";
import { getUser } from "../Redis/UserRedis";
const env = environmentsConfig();


//Con NodeCache comprobamos si esta en la caché el token, o si hay que ir a buscarlo a la db.
//Le ponemos un limite de vida de 60 minutos = 1 hora.

export function validateToken(token: string){
    return new Promise((resolve, reject) => {
        const userCache: boolean = getUser(token);
        if(userCache){
            
        }

        // Si el token no está en la caché, lo busco en el servicio de auth.
        axios.get(`${env.securityServer}/v1/users/current`, { headers: { "Authorization": token }})
        .then((data) => {
            // sessionCache.set(token, data); //Setteo el valor devuelto en la caché.
            return resolve(true);
        }).catch(() => {
            return reject(Error_token.INVALID_TOKEN);
        });
    });
    
}

// export function invalidateToken(token: string){
//     if(sessionCache.get(token)){
//         sessionCache.del(token);
//         console.log("Invalidate session token:", token);
//     }
// }