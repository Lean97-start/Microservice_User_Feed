export interface IReview{
    _id_user: string,
    _id_article: string,
    review_descript: string,
    score: number
}

export interface IState_Review{
    _id_review: string,
    stateReviewActive: boolean,
    reason_state: string
}