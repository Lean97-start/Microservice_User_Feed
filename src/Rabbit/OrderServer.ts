import {
  IMessageToSendValidationOrder,
  IValidateArticleBought,
} from "../Interface/OrderRabbit.Interface";
import { IRabbitMessage } from "../Interface/Rabbit.Interface";
import { sendMessage } from "./EmitterRabbit/Emitter";

export async function sendMessageValidateArticleBought(_id_user: string, _id_article: string): Promise<IRabbitMessage> {
  const messageToOrder: IRabbitMessage = {
    type: 'validate_article_bought_user',
    exchange: 'review',
    queue: 'review',
    message: {
      _id_user,
      _id_article,
      state_order: "PAYMENT_DEFINED",
    } as IMessageToSendValidationOrder,
  };
  return sendMessage(messageToOrder);
}
