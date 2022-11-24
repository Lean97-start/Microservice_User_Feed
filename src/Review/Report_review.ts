import { IUser } from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import errorsReport from '../Error/Error_report';
import { IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { searchStateReview } from "../Schema/State_review.model";
import { searchReview } from "../Schema/Review.model";
import { sendReportToReportServer } from "../Rabbit/ReportServer";


export async function addReportToReview(token: string, _id_review: string, reasonReport: string){
    try {
        const user: IUser = await getUser(token);
        let _id_user = user.id;
        let errors = errorHandle(_id_review, reasonReport);
        if(errors) return errors;

        //Busco en la DB la review que coincide con el _id_review pasado por parámetro.
        let reviewSearched: IReviewDB | any = await searchReview(_id_review);
        console.log(reviewSearched)
        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(reviewSearched._id);
        if(stateReviewSearched.stateReviewActive = false) {return (errorsReport.REPORTED_REVIEW)}

        let responseSentMessage = await sendReportToReportServer(_id_review, reasonReport, reviewSearched.review_descript, _id_user);
        if(responseSentMessage){
            return "Review reported"
        }else{
            return errorsReport.ERROR_SENT_MESSAGE;
        }
    } catch (error) {
        return errorsReport.ERROR_SERVER;
    }
}

export async function hiddenReviewReported(){
    console.log("SON EL OCULTADOR DE REVIEWS")
}


function errorHandle(_id_review: string , reasonReport: string ){
    if(!_id_review) return errorsReport.NULL_ID_REVIEW_NOT_ALLOWED;
    if(!reasonReport) return errorsReport.NULL_REPORT_REVIEW_NOT_ALLOWED;
    return false;
}