import { Schema, model } from "mongoose";
import { IReviewCreate, IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { IReview } from "../Interface/ReviewModel.Interface";
import error from '../Error/Error_article';
import errorReview from '../Error/Error_review';

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
    } catch (err: any) {
        console.log("Error en la creacion de una review en la DB", err.message);
        return error.ERROR_SERVER
    }
}


export async function searchReview(_id_review: string){ 
    try {
        let reviewSearched: any =  Review.findOne({_id: {$eq: _id_review}})
        .then((review: any)=> {
            return review
        }, (error:any )=> {
            return errorReview.NOT_EXIST_THE_REVIEW;
        })    
        .catch ((err: any )=> {return error.ERROR_SERVER}) 
        return reviewSearched; 
    } catch (err: any) {
        console.log("Error en la búsqueda de reviews en la DB", err.message);
        return error.ERROR_SERVER
    }
}


export async function modifyEnableReviewDB(_id_review: string){
    try {
        const reviewModify: IReviewDB | any = await Review.findOneAndUpdate({_id: {$eq: _id_review}}, {visibility: true}, {new: true});
        return reviewModify;    
    } catch (err: any) {
        console.log("Error en modificar la visibilidad en la DB", err.message);
        return error.ERROR_SERVER.error_message
    }
}


export async function modifyReviewDB(_id_review: string, review_descript: string, score: number){
    try {
        const reviewModify: IReviewDB | any = await Review.findOneAndUpdate({_id: {$eq: _id_review}, visibility: true}, {review_descript, score}, {new: true});
        return reviewModify;    
    } catch (err: any) {
        console.log("Error en modificar la review de la DB", err.message);
        return error.ERROR_SERVER
    }
}


export async function lowLogicReviewDB(_id_review: string){
    try {
        let response: IStateReviewDB | any = await Review.findOneAndUpdate({_id: {$eq: _id_review}}, {visibility: false}, {new: true})
            .then((review: any) => {
                return review;
            }, (error) => { return new Error(error)})
            .catch(() => {return error.ERROR_SERVER})  
        return response;
    } catch (err: any) {
      console.log("Error en la baja lógica en la DB", err.message);
      return error.ERROR_SERVER  
    }
}

export async function searchReviewByArticle(_id_article: string){
    try {
        let reviewsSearched: any =  Review.find({_id_awticle: {$eq: _id_article}, visibility: true})
        .then((reviews: any)=> {
            return reviews
        }, (error:any )=> {console.log(error)})    
        .catch ((err: any )=> {return error.ERROR_SERVER}) 
        return reviewsSearched;
    } catch (err: any) {
        console.log("Error en la búsqueda de artículos para el servicio de catálogo en la DB", err.message);
        return error.ERROR_SERVER 
    }
}