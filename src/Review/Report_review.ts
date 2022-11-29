import { IUser } from "../Interface/UserReq.Interface";
import { getUser } from "../Redis/UserRedis";
import errorsReport from '../Error/Error_report';
import errorsReview from '../Error/Error_review';
import { IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { modifyStateReviewReportedDB, searchStateReview } from "../Schema/State_review.model";
import { lowLogicReviewDB, searchReview } from "../Schema/Review.model";
import { sendReportToReportServer } from "../Rabbit/ReportServer";
import { IResponseReportServer } from "../Interface/ReportRabbit.interface";

//Manejador de errores.
function errorHandle(_id_review: string , reasonReport: string ){
    if(!_id_review) return errorsReport.NULL_ID_REVIEW_NOT_ALLOWED;
    if(reasonReport.length == 0) return errorsReport.NULL_REPORT_REVIEW_NOT_ALLOWED;
    return false;
}

//Función para reportar una review realizada por un usuario.
export async function addReportToReview(token: string, _id_review: string, reasonReport: string){
    try {
        const user: IUser = await getUser(token);
        let _id_user = user.id;
        let errors = errorHandle(_id_review, reasonReport);
        if(errors) return errors;

        //Busco en la DB la review que coincide con el _id_review pasado por parámetro.
        let reviewSearched: IReviewDB | any = await searchReview(_id_review);
        if(!reviewSearched){ return errorsReview.NOT_EXIST_THE_REVIEW};
        if(reviewSearched.visibility == false){return errorsReview.REVIEW_IS_HIDDEN};

        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(reviewSearched._id);
        if(stateReviewSearched.stateReviewActive == false) {return (errorsReport.REPORTED_REVIEW)}

        let responseSentMessage = await sendReportToReportServer(_id_review, reasonReport, reviewSearched.review_descript, _id_user);
        if(responseSentMessage){
            return {message: "Review reported"};
        }else{
            return errorsReport.ERROR_SENT_MESSAGE;
        }
    } catch (err: any) {
        console.log("Ocurrio un error en la creación de un reporte sobre una review SERVER", err.message)
        return new Error(errorsReport.ERROR_SERVER.error_message);
    }
}

//Función para ocultar una reseña cuando nos llega un mensaje asíncrono desde el Servicio de Reports.
export async function hiddenReviewReported(responseReportServer: IResponseReportServer){
    try{
        const {_id_review, stateReviewActive, reason_report} = responseReportServer;

        //Validamos que vienen todos los datos requeridos.
        if(!_id_review) return console.log(errorsReview.NULL_ID_REVIEW.error_message);
        if(!responseReportServer.hasOwnProperty('stateReviewActive')) return console.log(errorsReview.NULL_STATE_REVIEW_ACTIVE.error_message);
        if(!reason_report) return console.log(errorsReview.NULL_REASON_REPORT.error_message);
        if(reason_report.length == 0) return console.log(errorsReview.NULL_REASON_REPORT.error_message);

        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(_id_review);
        if(!stateReviewSearched){ return console.log(_id_review, errorsReview.NOT_EXIST_THE_STATE_REVIEW.error_message) };
        if(stateReviewSearched.stateReviewActive == false) {return console.log(_id_review, errorsReport.REPORTED_REVIEW.error_message)}
    
        const lowLogicReview = await lowLogicReviewDB(_id_review);
        const lowLogicStateReview = await modifyStateReviewReportedDB(_id_review, stateReviewActive, reason_report);
        if(lowLogicStateReview){
            console.log(`Review N° ${_id_review}, was hidden`)
        }else{
            console.log(`Could not hide the review N° ${_id_review}`)
        }
        return
    }catch(err: any){
        console.log("Ocurrio un error en el proceso de ocultar un reporte sobre una review SERVER", err.message)
        return new Error(err.message);
    }  
}