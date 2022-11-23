import amqp from 'amqplib';
import { environmentsConfig } from '../../Config/Environments';
import { IRabbitMessage } from '../../Interface/Rabbit.Interface';

const env = environmentsConfig();

export async function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage>{
    let messageSent;
    try {
        const conn = await amqp.connect(env.rabbitUrl);
        const channel = await conn.createChannel();
        const exchange = await channel.assertExchange(message.exchange, 'direct', {durable: false});
        const queue = await channel.assertQueue(message.queue, {durable: false});
        if(channel.publish(exchange.exchange, queue.queue, Buffer.from(JSON.stringify(message)))){
            console.log("Sent Message");
            messageSent = message;
            // conn.close()
        }     
    } catch (error) {
        console.log(`RabbitMQ ${message.exchange} connection failed: ${error}`);
        return Promise.reject(error);
    }
    return (messageSent)? Promise.resolve(message): Promise.reject(new Error("Not Send Message"));
}