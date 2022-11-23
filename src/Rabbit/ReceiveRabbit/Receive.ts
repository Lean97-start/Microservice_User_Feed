import amqp from "amqplib/callback_api";
import { EventEmitter } from 'node:events';
import { environmentsConfig } from "../../Config/Environments";
import { IResultARticleBought, PropsConsumer } from "../../Interface/OrderRabbit.Interface";
const emitterResponseArticleBought = new EventEmitter();
const env = environmentsConfig();

export async function createConsumer(propsConsumer: PropsConsumer) {
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) return new Error(errorConnection);
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.assertExchange(propsConsumer.exchange, 'direct', {durable: false});
                channel.assertQueue(propsConsumer.channel, { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    console.log(`Queue ${propsConsumer.channel} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg) console.log(JSON.parse(msg.content.toString()))
                        
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err) {
        console.log(err)
        createConsumer(propsConsumer);
        throw new Error(`Cannot create consumer with exchange ${propsConsumer.exchange} and channel ${propsConsumer.channel}`);
    }
}
export async function createConsumerArticleBought(propsConsumer: PropsConsumer) {
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) return new Error(errorConnection);
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.assertExchange(propsConsumer.exchange, 'direct', {durable: false});
                channel.assertQueue(propsConsumer.channel, { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, queue.queue)
                    console.log(`Queue ${propsConsumer.channel} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg) console.log(JSON.parse(msg.content.toString()))
                        // emitterResponseArticleBought.emit('responseOrderServer', msg);
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err) {
        console.log(err)
        createConsumer(propsConsumer);
        throw new Error(`Cannot create consumer with exchange ${propsConsumer.exchange} and channel ${propsConsumer.channel}`);
    }
}
export async function logoutSession(propsConsumer: PropsConsumer) {
    try {
        amqp.connect(env.rabbitUrl, (errorConnection: any, connection: amqp.Connection) => {
            if (errorConnection) return new Error(errorConnection);
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if (errorCreateChannel) return new Error(errorCreateChannel);
                channel.assertExchange(propsConsumer.exchange, 'direct', {durable: false});
                channel.assertQueue(propsConsumer.channel, { exclusive: true }, (errorAssertQueue, queue) => {
                    if(errorAssertQueue) throw errorAssertQueue;
                    channel.bindQueue(queue.queue, propsConsumer.exchange, queue.queue)
                    console.log(`Queue ${propsConsumer.channel} active and listening`);
                    channel.consume(queue.queue, (msg) => {
                        if(msg) console.log(JSON.parse(msg.content.toString()))
                        // emitterResponseArticleBought.emit('responseOrderServer', msg);
                    },{
                        noAck: true
                    });
                }); 
            });
        });
    } catch (err) {
        console.log(err)
        createConsumer(propsConsumer);
        throw new Error(`Cannot create consumer with exchange ${propsConsumer.exchange} and channel ${propsConsumer.channel}`);
    }
}
