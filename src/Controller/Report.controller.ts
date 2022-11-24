import { Request, Response } from "express";

import { addReportToReview } from "../Review/Report_review";


export async function addReportReview(req: Request, res: Response){
    let token: any = req.header("Authorization");
    token = token.split(" ")[1] //Separo el Bearer {token} para solo quedarme con el token.
    let {_id_review, reason} = req.body;
    let responseAddReportReview = await addReportToReview(token, _id_review, reason);
}