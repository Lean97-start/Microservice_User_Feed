import { sendMessageValidateArticleBought } from "../Rabbit/OrderServer";
import { getUser } from "../Redis/UserRedis";
import error from "../Error/Error_review";
import { EventEmitter } from 'node:events';
import { IResponseOrderServer, IReview, IReviewCreate, IReviewDB, IReviewModify, IStateReviewDB } from "../Interface/Review.interface";
import { IUser } from "../Interface/UserReq.Interface";
import errorReviewArticle from "../Error/Error_article";
import { createReview, deleteReviewDB, modifyReviewDB, searchReview } from "../Schema/Review.model";
import { createStateReview, searchStateReview } from "../Schema/State_review.model";
const listeOrderServer = new EventEmitter();


export async function consultUserArticleBought(token: string, _id_article: string) {
    const user: IUser = await getUser(token) //Tomamos el _id_user del token previamente validado en el middleware.
    let _id_user = user.id;
    sendMessageValidateArticleBought(_id_user, _id_article)
    .then(data => {
        console.log(data);
    })
    .catch(rej => {console.log(rej)})
    // console.log("Estoy envie el mensaje ",userBougthArticle);
    listeOrderServer.on("responseOrderServer", response => {
        if(!response.article_bought_user) return error.USER_NOT_BOUGHT_ARTICLE
        console.log(token, _id_article, _id_user, response)
        return "HOLA LEANDRO, FUNCIONÓ";
    })
}
export async function validatetUserArticleBought(responseOrderServer: any) {
    console.log("HOLA SOY EL VALIDADOR DE ARTICULOS COMPRADOS")
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
        let stateReviewCreated = await createStateReview(reviewCreated._id);
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
        if(reviewSearched._id_user !== _id_user){ return (errorReviewArticle.NOT_CANNOT_MODIFY_REVIEW_NOT_AUTHORIZATION)}
        
        //Busco el estado de la review por medio del id de la review.
        let stateReviewSearched: IStateReviewDB | any = await searchStateReview(reviewSearched._id);
        if(stateReviewSearched.stateReviewActive = false) {return (errorReviewArticle.REPORTED_REVIEW)}

        await deleteReviewDB(reviewSearched._id);
        return "Review deleted successfully";
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

/*
Publicar reseña
○ POST ( '/v1/reviews/createReview' )
○ Header
■ Authorization: Bearer {token}
○ Body
■ { _id_article: id }
○ Response
■ "200 OK":
{
_id_review: {id},
8
Leandro Morello - Legajo: 44199
review: {review_descript},
Score: {score}
user: {_id_User}
}
■ "400 BAD REQUEST":
{
Error_Message: {error_message}
}
■ "401 Unauthorized":
{
Error_Message: {error_message}
}
■ "404 NOT FOUND":
{
Error_Message: {error_message}
}
■ "500 Server Error":
{
Error_Message: {error_message}
}
*/