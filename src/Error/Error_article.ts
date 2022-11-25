export default {
  NULL_REVIEWS_NOT_ALLOWED: {errorCode: 400 ,error_message: "Null_reviews_not_allowed" },
  NULL_SCORE_NOT_ALLOWED: {errorCode: 400 ,error_message: "Null_score_not_allowed" },
  NULL_ID_ARTICLE_NOT_ALLOWED: {errorCode: 400 ,error_message: "Null_id_article_not_allowed" },
  NULL_ID_REVIEW_NOT_ALLOWED: {errorCode: 400 ,error_message: "Id review is required" },
  ARTICLE_NOT_BOUGHT: {errorCode: 400 ,error_message: "Article_not_bought" },
  INVALID_ID_REVIEW: {errorCode: 400 ,error_message: "Invalid _id_review" },
  MAXIMUN_SIZE_400_WORDS: {errorCode: 400 ,error_message: "Maximun size is 400 words" },
  MINIMUN_SIZE_5_WORDS: {errorCode: 400 ,error_message: "Minimun size is 5 words" },
  ERROR_SCORE: {errorCode: 400 ,error_message: "Error score" },
  ERROR_SERVER: {errorCode: 500 ,error_message: "An error occurred, try again" },
  ERROR_MODIFY_REVIEW: {errorCode: 500 ,error_message: "Error modify review, try again" },
  ERROR_DELETE_REVIEW: {errorCode: 500 ,error_message: "Error delete review, try again" },
  ERROR_VISIBILITY_FALSE: {errorCode: 400 ,error_message: "Error review equals false" },
  ERROR_COULD_NOT_BE_DELETE: {errorCode: 500 ,error_message: "Review could not be unsubscribed" },
  REPORTED_REVIEW: {errorCode: 400 ,error_message: "Reported review" },
  THERE_ARE_NOT_REVIEWS_ARTICLE : {errorCode: 200 ,error_message: "This article not has reviews"},
  NOT_CANNOT_MODIFY_REVIEW_NOT_AUTHORIZATION: {errorCode: 401 ,error_message: "Not authorization, you cannot modify the review" },
};
