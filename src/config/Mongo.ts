'use strict';

import {connect} from 'mongoose';
import { Config } from './Environments';

export async function connectDBMongo(env: Config): Promise<void>{ //Realizo la conexión a mongo.
    try {
        console.log("Trying connect with MONGODB")
        let connectionMongoDB = await connect(env.mongoDb);
        if(connectionMongoDB){
            console.log("Database connection created");
        }else{
            console.log("Failed connection with mongoDB, trying again in 5 seconds");
            setTimeout(() => connectDBMongo(env), 5000);
        }
    
    } catch (err: any) {
        console.log("Failed connection with mongoDB, trying again in 5 seconds");
        setTimeout(() => connectDBMongo(env), 5000);
    }
}