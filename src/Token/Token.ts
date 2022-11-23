import { environmentsConfig } from "../Config/Environments";
import axios from "axios";
import Error_token from "../Error/Error_token";
import { deleteSessionUser, getUser, setUser } from "../Redis/UserRedis";
import { ISession, IUser } from "../Interface/UserReq.Interface";
import { createUserReadis } from "../TEST/RedisUsersTEST";

const env = environmentsConfig();

export async function validateToken(token: string) {
  try {
    let userCache = await getUser(token);
    if (userCache) {
      return userCache; // if (userCache) return userCache;
    }
    let userTEST = createUserReadis(); //Llamo a una funcion que harckodea una session.
    let responseRedis: boolean = await setUser(token, userTEST);
    if (responseRedis) {
      return responseRedis;
    } else {
      return new Error("No se pudo settear el usuario en la caché");
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Función para eliminar una sesión
export async function invalidateToken(token: string) {
  let existUser = await getUser(token);
  if (existUser) {
    await deleteSessionUser(token);
    console.log("Invalidate session token:", token);
  }
}

//     // Si el token no está en la caché, lo busco en el servicio de auth.
//     axios.get(`${env.securityServer}/v1/users/current`, { headers: { "Authorization": token }})
//     .then(  (response) => {
//                 console.log(response.data, "PASS")
//                 setUser(token, response.data); //Setteo el valor devuelto en la caché.
//                 return true},

//             (reject) => {
//                 console.log(reject.data, "REJECT")
//                 return Error_token.INVALID_TOKEN
//             });
