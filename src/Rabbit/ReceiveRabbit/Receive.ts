import amqp from "amqplib/callback_api";
import { EventEmitter } from 'node:events';
import { environmentsConfig } from "../../Config/Environments";
import { IPropsConsumer, IPropsLogoutConsumer } from "../../Interface/OrderRabbit.Interface";
import { IRabbitMessage } from "../../Interface/Rabbit.Interface";

const emitterResponseArticleBought = new EventEmitter();
const env = environmentsConfig();


export async function createConsumer(propsConsumer: IPropsConsumer, functionType: any) {
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) {
                console.error(`No se pudo conectar a RABBITMQ la cola con routingKey ${propsConsumer.routingKey}, intentado reconexión en 5 segundos`);
                setTimeout(() => createConsumer(propsConsumer, functionType), 5000);
                return
            }else
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.on("close", function () {
                    console.error(`Se cerro la sesión de rabbit en el exchange ${propsConsumer.routingKey}, intentado reconexión en 5 segundos`);
                    setTimeout(() => createConsumer(propsConsumer, functionType), 5000);
                });
                channel.assertExchange(propsConsumer.exchange, 'direct', {durable: false});
                channel.assertQueue(propsConsumer.queue, { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, propsConsumer.routingKey)
                    console.log(`Queue ${propsConsumer.queue} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg){
                            let content: IRabbitMessage = JSON.parse(msg.content.toString());
                            if(msg) console.log(content);
                            return functionType(content);
                        }
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err: any) {
        console.error(`Se cerro la sesión de rabbit en el exchange ${propsConsumer.routingKey} por causa de ${err.message}, intentado reconexión en 5 segundos`);
        setTimeout(() => createConsumer(propsConsumer, functionType), 5000);
    }
}

export async function logoutSessionRabbit(propsConsumer: IPropsLogoutConsumer, functionType: any) {
    let queueCreated;
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) {
                console.error(`No se pudo conectar a RABBITMQ el exchange ${propsConsumer.exchange}, intentado reconexión en 5 segundos`);
                setTimeout(() => logoutSessionRabbit(propsConsumer, functionType), 5000);
                return
            }else
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.on("close", function () {
                    console.error(`Se cerro la sesión de rabbit en el exchange ${propsConsumer.exchange}, intentado reconexión en 5 segundos`);
                    setTimeout(() => logoutSessionRabbit(propsConsumer, functionType), 5000);
                });
                channel.assertExchange(propsConsumer.exchange, 'fanout', {durable: false});
                channel.assertQueue("logout", { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    queueCreated = queue.queue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, "")
                    console.log(`Queue ${queue.queue} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg){
                            let content: IRabbitMessage = JSON.parse(msg.content.toString());
                            console.log("Logout user with token: ",JSON.parse(msg.content.toString()))
                            return functionType(content);
                        }
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err: any) {
        console.error(`Se cerro la sesión de rabbit en el exchange ${propsConsumer.exchange} por causa de ${err.message}, intentado reconexión en 5 segundos`);
        setTimeout(() => logoutSessionRabbit(propsConsumer, functionType), 5000);
    }
}
