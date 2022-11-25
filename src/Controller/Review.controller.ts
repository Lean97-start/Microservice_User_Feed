import { Request, Response } from "express";
import errorArticleBought from "../Error/Error_review";
import errorReviewArticle from "../Error/Error_article";
import  {IUserReq}  from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import { addReview, consultUserArticleBought, deleteReview, modifyReview } from "../Review/Review";
import { ErrorResponse, IReviewCreate } from "../Interface/Review.interface";


export async function addReviewArticle(req: Request, res: Response){
    try {
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
        const {_id_article, review }= req.body;
        const addReviewResult: any = await addReview(token, _id_article, review);
        if(addReviewResult.hasOwnProperty("error_message")) res.status(addReviewResult.errorCode).json(addReviewResult.error_message)
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
        const modifyReviewResult: any = await modifyReview(token, _id_review, review);
        if(modifyReviewResult.hasOwnProperty("error_message")) res.status(modifyReviewResult.errorCode).json(modifyReviewResult.error_message)
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
        const deleteReviewResult: any = await deleteReview(token, _id_review);
        if(deleteReviewResult.hasOwnProperty("error_message")) res.status(deleteReviewResult.errorCode).json(deleteReviewResult.error_message)
        return res.send(deleteReviewResult);
    } catch (err) {
        return res.status(500).json(errorReviewArticle.ERROR_DELETE_REVIEW)
    }

}