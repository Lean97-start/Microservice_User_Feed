export interface IReportRabbit {
  _id_review: string;
  reason_report: string;
  review_description: string;
  user_reviewer: string;
}

export interface IResponseReportServer{
  _id_review: string,
  stateReviewActive: boolean,
  reason_report: string
}
