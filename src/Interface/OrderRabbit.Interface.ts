export interface IValidateArticleBought{
    responseValidation: boolean;
}

export interface IMessageToSendValidationOrder{
    _id_user: string,
    _id_article: string,
    state_order: string
}