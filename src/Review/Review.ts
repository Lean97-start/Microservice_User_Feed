import { sendMessageValidateArticleBought } from "../Rabbit/OrderServer";
import { getUser } from "../Redis/UserRedis";
import error from "../Error/Error_review";
import { EventEmitter } from 'node:events';
import { IReview, IReviewCreate, IReviewDB, IStateReviewDB } from "../Interface/Review.interface";
import { IUser } from "../Interface/UserReq.Interface";
import errorReviewArticle from "../Error/Error_article";
import { createReview, lowLogicReviewDB,  modifyEnableReviewDB, modifyReviewDB, searchReview, searchReviewByArticle } from "../Schema/Review.model";
import { createStateReview, searchStateReview } from "../Schema/State_review.model";
import { sendMessageReviewArticle } from "../Rabbit/CatalogServer";

//Función que consulta al servicio de Order si el usuario compro ese artículo.
export async function consultUserArticleBought(_id_user: string, _id_article: string, _id_review: string) {
    sendMessageValidateArticleBought(_id_user, _id_article, _id_review)
    .then(data => {console.log(data)})
    .catch(rej => {console.log(rej)});
}

//Función que valida la review realizada por el usuario.
export async function validatetUserArticleBought(responseOrderServer: any) {
    try {
        if(!responseOrderServer.article_bought_user){ return false}
        const reviewModified = await modifyEnableReviewDB(responseOrderServer._id_review);
        console.log(reviewModified);
        return;
    } catch (err) {
        throw err;
    }
}

//Función creadora de review de un artículo comprado por el usuario.
export async function addReview(token: string, _id_article:string, review: IReview){
    try {
        const user: IUser = await getUser(token) //Tomamos el _id_user del token previamente validado en el middleware.
        let _id_user = user.id;
        let errors = errorHandle(review.review_descrip, review.score, _id_article)
        if(errors){return errors};
        const objectReview: IReviewCreate = {
            _id_user,
            _id_article,
            review_descript: review.review_descrip,
            score: parseInt(review.score)
        }
        let reviewCreated: IReviewDB | any = await createReview(objectReview);
        await createStateReview(reviewCreated._id);

        //Mando un mensaje al Server de order.
        consultUserArticleBought(_id_user, _id_article, reviewCreated._id); 
        return "Create Review successful";
    } catch (err) {
        console.log(err);
        return error
    }
}

//Función modificadora de review de un artículo comprado por el usuario.
export async function modifyReview(token: string, _id_review:string, review: IReview){
    try {
        const user: IUser = await getUser(token) //Tomamos el _id_user del token previamente validado en el middleware.
        let _id_user = user.id;
        let errors = errorHandle(review.review_descrip, review.score, "" , _id_review)
        if(errors){return errors};

        //Busco en la DB la review que coincide con el _id_review pasado por parámetro.
        let reviewSearched: IReviewDB | any = await searchReview(_id_review);
        if(reviewSearched._id_user !== _id_user){ return (errorReviewArticle.NOT_CANNOT_MODIFY_REVIEW_NOT_AUTHORIZATION)}
        
        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(reviewSearched._id);
        if(stateReviewSearched.stateReviewActive = false) {return (errorReviewArticle.REPORTED_REVIEW)}

        //Validamos si lo que nos viene es null, le dejamos los valores que ya tienen.
        if(!review.review_descrip) { review.review_descrip = reviewSearched.review_descrip}
        if(!review.score) { review.score = reviewSearched.score}

        const reviewModified = await modifyReviewDB(reviewSearched._id, review.review_descrip, parseInt(review.score));
        console.log(reviewModified);
        return "Modified review";
    } catch (err) {
        console.log(err);
        return error
    }
}

//Función modificadora de review de un artículo comprado por el usuario.
export async function deleteReview(token: string, _id_review:string){
    try {
        const user: IUser = await getUser(token) //Tomamos el _id_user del token previamente validado en el middleware.
        let _id_user = user.id;
        if(!_id_review) return (errorReviewArticle.NULL_ID_REVIEW_NOT_ALLOWED);

        
        //Busco en la DB la review que coincide con el _id_review pasado por parámetro.
        let reviewSearched: IReviewDB | any = await searchReview(_id_review);
        if(reviewSearched._id_user !== _id_user){ return (errorReviewArticle.NOT_CANNOT_MODIFY_REVIEW_NOT_AUTHORIZATION)};
        if(reviewSearched.visibility === false){ return (errorReviewArticle.ERROR_VISIBILITY_FALSE)};
        
        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(reviewSearched._id);
        if(stateReviewSearched.stateReviewActive = false) {return (errorReviewArticle.REPORTED_REVIEW)};

        let resultDeleteReview = await lowLogicReviewDB(reviewSearched._id);
        if(resultDeleteReview){
            return "Review deleted successfully";
        }else{
            return errorReviewArticle.ERROR_COULD_NOT_BE_DELETE;
        }
    } catch (err) {
        console.log(err);
        return errorReviewArticle.ERROR_DELETE_REVIEW;
    }
}


//Funcion manejadora de errores.
function errorHandle( review_descrip:string, score: string, _id_article?:string , _id_review?: string){
    if(_id_article?.length){
        if(!_id_article) return (errorReviewArticle.NULL_ID_ARTICLE_NOT_ALLOWED);
        if(!review_descrip) return (errorReviewArticle.NULL_REVIEWS_NOT_ALLOWED);
        if(!score) return (errorReviewArticle.NULL_SCORE_NOT_ALLOWED);
    }
    if(!_id_article){
        if(!_id_review){
            return (errorReviewArticle.NULL_ID_REVIEW_NOT_ALLOWED);
        }
    }

    let countWords = review_descrip.split(" ");
    if(countWords.length < 5){
        return (errorReviewArticle.MINIMUN_SIZE_5_WORDS);
    } else if(countWords.length > 400){
        return (errorReviewArticle.MAXIMUN_SIZE_400_WORDS);
    }
    if(parseInt(score) <= 0 || parseInt(score) >= 6){
        return (errorReviewArticle.ERROR_SCORE)
    }
    return false;
}

//Función que retorna al servicio de catalog todas las reseñas de un artículo.
export async function showAllReviewArticle(_id_article: string){
   try {
    //Busco en la DB la review que coincide con el _id_review pasado por parámetro.
    let reviewSearched: Array<IReviewDB> | any = await searchReviewByArticle(_id_article);
    if(reviewSearched.length){return console.log(reviewSearched)};
    return console.log("No tiene reseñas")
    // if(reviewSearched._id_user !== _id_user){ return (errorReviewArticle.NOT_CANNOT_MODIFY_REVIEW_NOT_AUTHORIZATION)}
   } catch (error) {
    
   } 
    // sendMessageReviewArticle(_id_article,);
}