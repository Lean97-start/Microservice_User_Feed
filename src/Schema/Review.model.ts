import { Schema, model } from "mongoose";
import { IReviewCreate, IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { IReview } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';
import { deleteStateReview } from "./State_review.model";

const review = new Schema <IReview>(
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
export default IReview;

export async function createReview(review: IReviewCreate){
    try {
        const responseInsert = await Review.create(review);
        return responseInsert;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}


export async function searchReview(_id: string){
    console.log(_id) 
    let reviewSearched: any =  Review.findOne({_id_review: {$eq: _id}})
    .then((review: any)=> {
        console.log("Estoy dentro", review);
        return review
    }, (error:any )=> {console.log(error)})    
    .catch ((err: any )=> {return error.ERROR_SERVER}) 
    return reviewSearched;
}


export async function modifyReviewDB(_id_review: string, review_descript: string, score: number){
    try {
        const reviewModify: IReviewDB | any = await Review.findOneAndUpdate({_id: _id_review}, {review_descript, score}, {new: true});
        return reviewModify;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}
export async function deleteReviewDB(_id_review: string){
    console.log(_id_review)
        let response = Review.findOneAndDelete({_id: {$eq: _id_review}})
            .then((review: any) => { 
                deleteStateReview(review._id)
                .then(() => {
                    return
                }, (error) => { return new Error(error)})
                return review;
            }, (error) => { return new Error(error)})
            .catch(() => {return error.ERROR_SERVER})
        return response;
    }
