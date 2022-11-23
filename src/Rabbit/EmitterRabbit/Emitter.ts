import amqp from 'amqplib/callback_api';
import { environmentsConfig } from '../../Config/Environments';
import { IRabbitMessage } from '../../Interface/Rabbit.Interface';

const env = environmentsConfig();

export async function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage>{
    const channel = await getChannel(message.exchange);
    channel.assertExchange(message.exchange, 'direct', {durable: false});
    channel.assertQueue(message.queue, {durable: false});

    if(channel.publish(message.exchange, message.queue, Buffer.from(JSON.stringify(message.message)))){
        console.log("Sent Message");
        return Promise.resolve(message);
    }else{
        return Promise.reject(new Error("Not Send Message"));
    }
}


//Función que me permite crear el canal y devolverlo a la función invocadora.
function getChannel(exchange: string): Promise<amqp.Channel>{
    let channelResponse;
    try {
        amqp.connect(env.rabbitUrl, (errorConection: any, connection: amqp.Connection) => {
            if(errorConection) return Promise.reject(errorConection); 
            connection.createChannel((errorCreateChannel: any, channel: amqp.Channel) => {
                if(errorCreateChannel) return Promise.reject(errorCreateChannel); 
                channelResponse = channel;
                channelResponse.on("close", function () {
                    console.error(`RabbitMQ ${exchange} connection closed`);
                    channelResponse = undefined;
                });
            })
        })
    } catch (err) {
        console.log(`RabbitMQ ${exchange} connection failed: ${err}`);
        channelResponse = undefined;
        return Promise.reject(err);
    }
    if(channelResponse){
        return Promise.resolve(channelResponse); 
    }else{
        return Promise.reject(new Error("No channel available"))
    }
}