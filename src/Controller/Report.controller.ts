import { Request, Response } from "express";
import errorServer from '../Error/Error_article';
import { addReportToReview } from "../Review/Report_review";


export async function addReportReview(req: Request, res: Response){
    try{
        //Tomo el token del header.
        let token: any = req.header("Authorization");
        token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.

        //Tomo los datos del body.
        let {_id_review, reason} = req.body;

        let responseAddReportReview: any = await addReportToReview(token, _id_review, reason);

        //Valido si ocurrido algún error en el proceso de crear un reporte de una review.
        if(responseAddReportReview.hasOwnProperty("error_message")) res.status(responseAddReportReview.errorCode).json(responseAddReportReview.error_message)
        
        return res.status(200).send(responseAddReportReview);

    }catch(err: any){
        console.log("Ocurrío un error en la creción del reporte CONTROLLER", err.message)
        res.status(errorServer.ERROR_SERVER.errorCode).json(errorServer.ERROR_SERVER.error_message)
    }
}