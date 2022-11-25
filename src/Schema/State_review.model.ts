import { Schema, model } from "mongoose";
import { IStateReviewCreate, IStateReviewDB } from "../Interface/Review.interface";
import { IState_Review } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';

const state_review = new Schema <IState_Review>(
    {
        _id_review: {
            type: String,
            requerid: true
        },
        stateReviewActive: {
            type: Boolean,
            requerid: true
        },
        reason_state: {
            type: String,
            requerid: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const state_Review = model('State_Review', state_review); //Vinculo el schema en el modelo.
export default state_Review;



//Función que me permite crear un estado asociado a una review.
export async function createStateReview(_id_review: string){
    try{
        const objectStateReview: IStateReviewCreate = {
            _id_review,
            stateReviewActive: true,
            reason_state: ""
        }
        const stateReviewCreated = state_Review.create(objectStateReview)
        return stateReviewCreated;
    }catch(err){
        throw error.ERROR_SERVER
    }
}

//Función que me permite buscar el estado de una review.
export async function searchStateReview(_id: string){
    try {
        const stateReviewFound = await state_Review.findOne({_id_review: _id});
        return stateReviewFound;    
    } catch (err) {
        throw error.ERROR_SERVER
    }
}

//Función que me permite cambiar el estado de un review que ha sido reportada
export async function modifyStateReviewReportedDB(_id_review: string, stateReviewActive: boolean, reason_report: string){
    try {
        const stateReviewModifyReported: IStateReviewDB | any = await state_Review.findOneAndUpdate({_id: _id_review}, {stateReviewActive, reason_state: reason_report}, {new: true});
        return stateReviewModifyReported;    
    } catch (err) {
        throw error.ERROR_SERVER
    }
}