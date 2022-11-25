import { Request, Response } from "express";
import errorServer from '../Error/Error_article';
import { addReportToReview } from "../Review/Report_review";


export async function addReportReview(req: Request, res: Response){
    try{
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
        let {_id_review, reason} = req.body;
        let responseAddReportReview: any = await addReportToReview(token, _id_review, reason);
        if(responseAddReportReview.hasOwnProperty("error_message")) res.status(responseAddReportReview.errorCode).json(responseAddReportReview.error_message)
        return res.status(200).send(responseAddReportReview);
    }catch(err){
        res.status(errorServer.ERROR_SERVER.errorCode).json(errorServer.ERROR_SERVER.error_message)
    }
}