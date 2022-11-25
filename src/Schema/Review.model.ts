import { Schema, model } from "mongoose";
import { IReviewCreate, IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { IReview } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';

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
        },
        visibility: {
            type: Boolean,
            required: true,
            default: false
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


export async function modifyEnableReviewDB(_id_review: string){
    try {
        const reviewModify: IReviewDB | any = await Review.findOneAndUpdate({_id: _id_review}, {visibility: true}, {new: true});
        return reviewModify;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}


export async function modifyReviewDB(_id_review: string, review_descript: string, score: number){
    try {
        const reviewModify: IReviewDB | any = await Review.findOneAndUpdate({_id: _id_review, visibility: true}, {review_descript, score}, {new: true});
        return reviewModify;    
    } catch (err) {
        return error.ERROR_SERVER
    }
}


export async function lowLogicReviewDB(_id_review: string){
    console.log(_id_review)
        let response = Review.findOneAndUpdate({_id: {$eq: _id_review}, visibility: true}, {visibility: false}, {new: true})
            .then((review: any) => {
                console.log(review);
                return review;
            }, (error) => { return new Error(error)})
            .catch(() => {return error.ERROR_SERVER})
        return response;
    }

export async function searchReviewByArticle(_id_article: string){
    let reviewsSearched: any =  Review.find({_id_awticle: {$eq: _id_article}, visibility: true})
    .then((reviews: any)=> {
        console.log("Estoy dentro", reviews);
        return reviews
    }, (error:any )=> {console.log(error)})    
    .catch ((err: any )=> {return error.ERROR_SERVER}) 
    return reviewsSearched;
}