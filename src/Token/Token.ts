import { environmentsConfig } from "../Config/Environments";
import axios from "axios";
import Error_token from "../Error/Error_token";
import { deleteSessionUser, getUser, setUser } from "../Redis/UserRedis";
import { ISession, ITokenLogout, IUser } from "../Interface/UserReq.Interface";
import { createUserReadis } from "../TEST/RedisUsersTEST";

const env = environmentsConfig();

export async function validateToken(token: string) {
  try {
    //Busco la sesión del usuario en la caché.
    let userCache = await getUser(token);
    if (userCache) {
      return true;
    }
  
    // Si el token no está en la caché, lo busco en el servicio de auth.
    let responseSaveCacheUser = await axios.get(
      `${env.securityServer}/v1/users/current`, { headers: { "Authorization": `bearer ${token}`}})
      .then(  async (response) => {
                  if (await setUser(token, response.data)) {
                    return true;
                  }
                  return false;
                },
              (reject) => {
                  console.log("No lo pudo obtener al user del servicio de AUTH")
                  return false;
              });
    return responseSaveCacheUser;

  } catch (err) {
    console.log(err);
    return err;
  }
}

// Función para eliminar una sesión
export async function invalidateToken(logout: ITokenLogout) {
  let token = logout.message.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
  let existUser = await getUser(token);
  if (existUser) {
    if(await deleteSessionUser(token)){
      console.log("Invalidate session token:", token);
    }
  }else{
    console.log("User be not in cache")
  }
}
