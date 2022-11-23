export interface IRabbitMessage{
    type: string,
    exchange: string,
    queue: string,
    message: any
}