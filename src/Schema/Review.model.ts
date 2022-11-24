import { Schema, model } from "mongoose";
import { IReviewCreate, IReviewDB } from "../Interface/Review.interface";
import { Review } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';

const review = new Schema <Review>(
    {
        _id_user: {
            type: String,
            required: true
        },
        _id_article: {
            type: String,
            required: true
        },
        review_descript: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Review = model('Review', review); //Vinculo el schema en el modelo.
export default Review;

export async function createReview(review: IReviewCreate){
    try {
        const responseInsert = await Review.create(review);
        return responseInsert;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}
export async function searchReview(_id_review: string){
    try {
        const reviewFound: IReviewDB | any = await Review.findOne({_id_review});
        return reviewFound;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}

