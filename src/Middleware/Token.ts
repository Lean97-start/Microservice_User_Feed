import { Request, Response, NextFunction } from "express";
import {IUserReq } from "../Interface/UserReq.Interface";
import error from "../Error/Error_token";
import { environmentsConfig } from "../Config/Environments";
import { validateToken } from "../Token/Token";
const env = environmentsConfig();


export async function validationToken( req: Request, res: Response, next: NextFunction ){

    let token = req.header("Authorization"); //Extraigo el token.

    if (!token) {return res.status(401).json(error.NULL_TOKEN)} //Token NULL

    token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.

    validateToken(token) //Realizo la validación de token por caché.
    .then(userToken  => {
        if(userToken){
            next();
        }else{
            return res.status(401).json(error.INVALID_TOKEN);
        }     
    })
    .catch(errorCatch => console.log(errorCatch))    
}



