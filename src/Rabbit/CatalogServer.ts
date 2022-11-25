  import { IRabbitMessage } from "../Interface/Rabbit.Interface";
  import { showAllReviewArticle } from "../Review/Review";
  import { sendMessage } from "./EmitterRabbit/Emitter";
  import { createConsumer } from "./ReceiveRabbit/Receive";
  import { IReviewCreate } from "../Interface/Review.interface";
  
  export async function sendMessageReviewArticle(_id_article: string, reviews: Array<IReviewCreate>): Promise<IRabbitMessage> {
    const messageToOrder: IRabbitMessage = {
      type: 'article_reviews',
      exchange: 'catalog',
      queue: 'article_reviews',
      message: {
        _id_article,
        reviews,
      },
    };
    return sendMessage(messageToOrder);
  }
  
  //Función que se inicializará y quedara escuchando en el canal para resultados que envie el servicio de order.
  export async function consumerAllReviewArticle(){
    const propsConsumer = {
      exchange: "review",
      queue: "review_catalog",
      routingKey: "reviews_article"
    }
    await createConsumer(propsConsumer, showAllReviewArticle);
  }