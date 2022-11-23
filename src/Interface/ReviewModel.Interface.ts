export interface Review{
    _id_user: string,
    _id_article: string,
    review_descript: string,
    score: number
}

export interface State_Review{
    _id_review: string,
    stateReviewActive: boolean,
    reason_state: string
}