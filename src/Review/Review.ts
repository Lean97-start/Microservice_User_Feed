import { sendMessageValidateArticleBought } from "../Rabbit/OrderServer";
import { getUser } from "../Redis/UserRedis";
import error from "../Error/Error_review";
import { EventEmitter } from 'node:events';
import { IResponseOrderServer, IReview } from "../Interface/Review.interface";
import { IUser } from "../Interface/UserReq.Interface";
import errorReviewArticle from "../Error/Error_article";
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
export async function validatetUserArticleBought(response: IResponseOrderServer) {
}


export async function addReview(token: string, _id_article:string, review: IReview){
    const user: IUser = await getUser(token) //Tomamos el _id_user del token previamente validado en el middleware.
    let _id_user = user.id;
    if(!_id_article) return (errorReviewArticle.NULL_ID_ARTICLE_NOT_ALLOWED);
    if(!review.review_descrip) return (errorReviewArticle.NULL_REVIEWS_NOT_ALLOWED);
    if(!review.score) return (errorReviewArticle.NULL_SCORE_NOT_ALLOWED);
    let countWords = review.review_descrip.split(" ");
    if(countWords.length < 5){
        return (errorReviewArticle.MINIMUN_SIZE_5_WORDS);
    } else if(countWords.length > 400){
        return (errorReviewArticle.MAXIMUN_SIZE_400_WORDS);
    }
    if(parseInt(review.score) <= 0 || parseInt(review.score) >= 6){
        return (errorReviewArticle.ERROR_SCORE)
    }
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