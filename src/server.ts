"use strict";
import { environmentsConfig } from './server/environments';
import { initExpress } from "./server/express";
import { connectDBMongo } from './config/Mongo';

const config = environmentsConfig(); //Variables de entorno
const PORT = config.port;

// Conexión a mongo.
connectDBMongo(config).then(
    () => console.log("Database ready"),
    () => console.log("Connection database failed")
);

//Inicio instancia de express
const app = initExpress(config);

// Conexiones a rabbit.

//Levanto instancia de server
app.listen(PORT, () => {
    console.log("Listen on the port", PORT)
})