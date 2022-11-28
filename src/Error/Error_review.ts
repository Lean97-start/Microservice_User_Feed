export default {
    NULL_ID_ARTICLE : {errorCode: 400, error_message: "Null _id_article, it is required"},
    NULL_ID_REVIEW : {errorCode: 400, error_message: "Null _id_review, it is required"},
    NULL_STATE_REVIEW_ACTIVE : {errorCode: 400, error_message: "Null state review active, it is required"},
    NULL_REASON_REPORT : {errorCode: 400, error_message: "Null reason_report, it is required"},
    USER_NOT_BOUGHT_ARTICLE : {errorCode: 400 ,error_message: "User not bought article"},
    REVIEW_IS_HIDDEN : {errorCode: 400 ,error_message: "The review is hidden"},
    NOT_EXIST_THE_REVIEW: {errorCode: 400 ,error_message: "The review does not exist" },
    NOT_EXIST_THE_STATE_REVIEW: {errorCode: 400 ,error_message: "The state review does not exist" },
    THERE_IS_NOT_ID_REVIEW: {errorCode: 400 ,error_message: "The _id_review not exist, it is required" },
    THERE_IS_NOT_ARTICLE_BOUGHT_USER: {errorCode: 400 ,error_message: "The article_bought_user not exist, it is required" },
    ERROR_SERVER: {errorCode: 500 ,error_message: "Error server" },
}