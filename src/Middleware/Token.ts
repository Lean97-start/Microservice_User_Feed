import { Request, Response, NextFunction } from "express";
import {IUserReq } from "../Interface/UserReq.Interface";
import error from "../Error/Error_token";
import { environmentsConfig } from "../Config/Environments";
import { validateToken } from "../Token/Token";
const env = environmentsConfig();


export async function validationToken( req: Request, res: Response, next: NextFunction ){
    const token = req.header("Authorization"); //Extraigo el token.
    if (!token) {//Token null.
        return res.status(401).json(error.NULL_TOKEN);
    }
    try {
        const validationToken = await validateToken(token); //Realizo la validación de token por caché.
        if(validationToken){
            next();
        }       
    } catch (err) {
        return res.status(401).json(error.INVALID_TOKEN);
    }
}



