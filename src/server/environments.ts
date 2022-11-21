'use strict';
import 'dotenv/config';

let env = process.env;
let config: Config

export function environmentsConfig(): Config {
    if(!config){
        config = {
            port: env.SERVER_PORT || "4100",            
            mongoDb: env.MONGO_URL || "mongodb://localhost/review",
            securityServer: env.AUTH_SERVICE_URL || "http://localhost:3000",
            catalogServer: env.CATALOG_SERVICE_URL ||"http://localhost:3002",
            orderServer: env.ORDER_SERVICE_URL || "http://localhost:3003",
            rabbitUrl: env.RABBIT_URL || "amqp://localhost" 
        }
    }
    return config;
}


export interface Config {
    port: string;
    mongoDb: string;
    securityServer: string;
    catalogServer: string;
    orderServer: string
    rabbitUrl: string;
}

