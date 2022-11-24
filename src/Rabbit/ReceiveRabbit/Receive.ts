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
            if (errorConnection) return new Error(errorConnection);
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.assertExchange(propsConsumer.exchange, 'direct', {durable: false});
                channel.assertQueue(propsConsumer.queue, { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, queue.queue)
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
    } catch (err) {
        console.log(err)
        createConsumer(propsConsumer, functionType);
        throw new Error(`Cannot create consumer with exchange ${propsConsumer.exchange} and queue ${propsConsumer.queue}`);
    }
}

export async function logoutSessionRabbit(propsConsumer: IPropsLogoutConsumer, functionType: any) {
    let queueCreated;
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) return new Error(errorConnection);
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.assertExchange(propsConsumer.exchange, 'fanout', {durable: false});
                channel.assertQueue("", { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    queueCreated = queue.queue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, queue.queue)
                    console.log(`Queue ${queue.queue} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg){
                            let content: IRabbitMessage = JSON.parse(msg.content.toString());
                            return functionType(content);
                        }
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err) {
        console.log(err)
        // createConsumer(propsConsumer);
        throw new Error(`Cannot create consumer with exchange ${propsConsumer.exchange} and queue ${queueCreated}`);
    }
}
