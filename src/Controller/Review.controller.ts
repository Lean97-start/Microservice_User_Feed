import { Request, Response } from "express";
import error from "../Error/Error_review";
import  {IUserReq}  from "../Interface/UserReq.Interface";
import { consultUserArticleBought } from "../Review/Review";


export function ConsultArticleBought(req: Request, res: Response){
    const _id_article = req.body; // { _id_article: id }
    if(!_id_article) return res.status(400).json(error.NULL_ID_ARTICLE);
    // const _id_user = req.user.user.id; //Tomamos el _id_user del token previamente validado en el middleware.
    // const responseConsultArticleBought = consultUserArticleBought(_id_user);
}