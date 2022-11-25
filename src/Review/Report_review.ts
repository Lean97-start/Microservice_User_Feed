import { IUser } from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import errorsReport from '../Error/Error_report';
import { IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { modifyStateReviewReportedDB, searchStateReview } from "../Schema/State_review.model";
import { lowLogicReviewDB, searchReview } from "../Schema/Review.model";
import { sendReportToReportServer } from "../Rabbit/ReportServer";


//Función para reportar una review realizada por un usuario.
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

//Función para ocultar una reseña cuando nos llega un mensaje asíncrono desde el Servicio de Reports.
export async function hiddenReviewReported(_id_review: string, stateReviewActive: boolean, reason_report: string){
    try{
        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(_id_review);
        if(stateReviewSearched.stateReviewActive = false) {return (errorsReport.REPORTED_REVIEW)}
    
        const lowLogicReview = await lowLogicReviewDB(_id_review);
        const lowLogicStateReview = await modifyStateReviewReportedDB(_id_review, stateReviewActive, reason_report);
        console.log(lowLogicReview)
        console.log(lowLogicStateReview);
        console.log("Se oculto la review N°", _id_review)
        return
    }catch(err){
        throw err;
    }  
}

//Manejador de errores.
function errorHandle(_id_review: string , reasonReport: string ){
    if(!_id_review) return errorsReport.NULL_ID_REVIEW_NOT_ALLOWED;
    if(!reasonReport) return errorsReport.NULL_REPORT_REVIEW_NOT_ALLOWED;
    return false;
}