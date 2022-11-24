import { Request, Response } from "express";
import errorArticleBought from "../Error/Error_review";
import errorReviewArticle from "../Error/Error_article";
import  {IUserReq}  from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import { addReview, consultUserArticleBought, deleteReview, modifyReview } from "../Review/Review";

export function ConsultArticleBought(req: Request, res: Response){
    let token: any = req.header("Authorization");
    token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
    const _id_article = req.body; // { _id_article: id }
    if(!_id_article) return res.status(400).json(errorArticleBought.NULL_ID_ARTICLE);
    const responseConsultArticleBought = consultUserArticleBought(token, _id_article);
    res.send(responseConsultArticleBought);
}


export async function addReviewArticle(req: Request, res: Response){
    try {
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
        const {_id_article, review }= req.body;
        const addReviewResult = await addReview(token, _id_article, review);
        if(addReviewResult.hasOwnProperty("error_message")) res.json(addReviewResult)
        return res.send(addReviewResult);
        
    } catch (err) {
        return res.status(500).json(errorReviewArticle.ERROR_SERVER)
    }

}
export async function modifyReviewArticle(req: Request, res: Response){
    try {
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
        const {_id_review, review }= req.body;
        const modifyReviewResult = await modifyReview(token, _id_review, review);
        if(modifyReviewResult.hasOwnProperty("error_message")) res.json(modifyReviewResult)
        return res.send(modifyReviewResult);
        
    } catch (err) {
        return res.status(500).json(errorReviewArticle.ERROR_SERVER)
    }
}

export async function deleteReviewArticle(req: Request, res: Response){
    try {
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
        const { _id_review }= req.body;
        const deleteReviewResult = await deleteReview(token, _id_review);
        if(deleteReviewResult.hasOwnProperty("error_message")) res.json(deleteReviewResult)
        return res.send(deleteReviewResult);
    } catch (err) {
        return res.status(500).json(errorReviewArticle.ERROR_DELETE_REVIEW)
    }

}