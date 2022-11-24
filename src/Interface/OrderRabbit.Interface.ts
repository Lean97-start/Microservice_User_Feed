export interface IValidateArticleBought{
    responseValidation: boolean;
}

export interface IMessageToSendValidationOrder{
    _id_user: string,
    _id_article: string,
    state_order: string
}

export interface IPropsConsumer{
    exchange: string,
    queue: string
}

export interface IPropsLogoutConsumer{
    exchange: string
}

export interface IResultARticleBought{
    article_bought_user: boolean
}