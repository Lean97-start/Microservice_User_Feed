export interface IResponseOrderServer{
    _id_user: string,
    _id_article: string,
    article_bought_user: boolean
}

export interface IReview{
    review_descrip: string,
    score: string
}

export interface IReviewCreate{
    _id_user: string,
    _id_article: string,
    review_descript: string,
    score: number
}