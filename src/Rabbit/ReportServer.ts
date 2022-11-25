import { IRabbitMessage } from "../Interface/Rabbit.Interface";
import { IReportRabbit } from "../Interface/ReportRabbit.interface";
import { hiddenReviewReported } from "../Review/Report_review";
import { sendMessage } from "./EmitterRabbit/Emitter";
import { createConsumer } from "./ReceiveRabbit/Receive";

export async function sendReportToReportServer(_id_review: string, reason_report: string, review_description: string, user_reviewer: string){
    const messageToReport: IRabbitMessage = {
        type: 'review_report_check',
        exchange: 'report',
        queue: 'review_report_check',
        message: {
            _id_review,
            reason_report,
            review_description,
            user_reviewer
        } as IReportRabbit
    }
    return sendMessage(messageToReport); 
}

//Función que se inicializará y quedara escuchando en el canal para resultados que envie el servicio de order.
export async function consumerReportServer(){
    const propsConsumer = {
      exchange: 'review',
      queue: 'review_report',
      routingKey: 'result_check_review_report'
    }
    //Creo el consumidor y le paso la funcion que ejecutara cuando llega un mensaje.
    await createConsumer(propsConsumer, hiddenReviewReported);
  }