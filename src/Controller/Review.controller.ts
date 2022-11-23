import { Request, Response } from "express";
import errorArticleBought from "../Error/Error_review";

import  {IUserReq}  from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import { addReview, consultUserArticleBought } from "../Review/Review";

export function ConsultArticleBought(req: Request, res: Response){
    let token: any = req.header("Authorization");
    token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
    const _id_article = req.body; // { _id_article: id }
    if(!_id_article) return res.status(400).json(errorArticleBought.NULL_ID_ARTICLE);
    const responseConsultArticleBought = consultUserArticleBought(token, _id_article);
    res.send(responseConsultArticleBought);
}


export function addReviewArticle(req: Request, res: Response){
    let token: any = req.header("Authorization");
    token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
    const [_id_article, review ]= req.body;
    const addReviewResult = addReview(token, _id_article, review)
     

}