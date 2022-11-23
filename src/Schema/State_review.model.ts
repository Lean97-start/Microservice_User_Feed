import { Schema, model } from "mongoose";
import { State_Review } from "../Interface/ReviewModel.Interface";


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