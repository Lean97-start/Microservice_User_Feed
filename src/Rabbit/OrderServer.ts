import {
  IMessageToSendValidationOrder,
  IValidateArticleBought,
} from "../Interface/OrderRabbit.Interface";
import { IRabbitMessage } from "../Interface/Rabbit.Interface";
import { sendMessage } from "./EmitterRabbit/Emitter";
import { createConsumerArticleBought } from "./ReceiveRabbit/Receive";

export async function sendMessageValidateArticleBought(_id_user: string, _id_article: string): Promise<IRabbitMessage> {
  const messageToOrder: IRabbitMessage = {
    type: 'validate_article_bought_user',
    exchange: 'validate_article_bought_user',
    queue: 'validate_article_bought_user',
    message: {
      _id_user,
      _id_article,
      state_order: "PAYMENT_DEFINED",
    } as IMessageToSendValidationOrder,
  };
  return sendMessage(messageToOrder);
}

//Función que se inicializará y quedara escuchando en el canal para resultados que envie el servicio de order.
export async function consumerResponseArticleBought(){
  const propsConsumer = {
    exchange: "article_bought_user",
    channel: "article_bought_user"
  }
  await createConsumerArticleBought(propsConsumer);
}