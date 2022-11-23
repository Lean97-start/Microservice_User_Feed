"use strict";
import { environmentsConfig } from './Config/Environments';
import { initExpress } from "./Server/Express";
import { connectDBMongo } from './Config/Mongo';
import { redisInit } from './Redis/UserRedis';

const config = environmentsConfig(); //Variables de entorno
const PORT = config.port;

// Conexión a mongo.
connectDBMongo(config).then(
    () => console.log("Database ready"),
    () => console.log("Connection database failed")
);

//Inicio instancia de express
const app = initExpress(config);

// Conexión Redis
redisInit();

// Conexiones a rabbit.

//Levanto instancia de server
app.listen(PORT, () => {
    console.log("Listen on the port", PORT)
})