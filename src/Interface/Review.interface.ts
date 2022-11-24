export interface IResponseOrderServer {
  _id_user: string;
  _id_article: string;
  article_bought_user: boolean;
}

export interface IReview {
  review_descrip: string;
  score: string;
}

export interface IReviewCreate {
  _id_user: string;
  _id_article: string;
  review_descript: string;
  score: number;
}
export interface IReviewModify {
  _id_user: string;
  _id_review: string;
  review_descript: string;
  score: number;
}

export interface IStateReviewCreate {
  _id_review: string;
  stateReviewActive: boolean;
  reason_state: string;
}

export interface IReviewDB {
  _id_user: string;
  _id_article: string;
  review_descript: string;
  score: number;
  _id: object;
  createdAt: Date;
  updatedAt: Date;
}
export interface IStateReviewDB {
  _id: string;
  _id_review: string;
  stateReviewActive: boolean;
  reason_state: string;
  createdAt: Date;
  updatedAt: Date;
}
