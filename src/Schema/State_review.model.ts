import { Schema, model } from "mongoose";
import { IStateReviewCreate } from "../Interface/Review.interface";
import { State_Review } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';

const state_review = new Schema <State_Review>(
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
        return error.ERROR_SERVER
    }
}

export async function searchStateReview(_id_review: string){
    try {
        const reviewFound = await state_Review.findOne({_id_review});
        return reviewFound;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}