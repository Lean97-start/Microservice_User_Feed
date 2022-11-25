"use strict";
import { environmentsConfig } from './Config/Environments';
import { initExpress } from "./Server/Express";
import { connectDBMongo } from './Config/Mongo';
import { redisInit } from './Redis/UserRedis';
import { consumerResponseArticleBought } from './Rabbit/OrderServer';
import { consumerReportServer } from './Rabbit/ReportServer';
import { logoutSession } from './Rabbit/AuthorizationServer';
import { consumerAllReviewArticle } from './Rabbit/CatalogServer';

const config = environmentsConfig(); //Variables de entorno
const PORT = config.port;

// Conexión a mongo.
connectDBMongo(config).then(
    () => console.log("Database ready"),
    () => console.log("Connection database failed")
);

// Conexión Redis
redisInit();

// Conexiones a rabbit.
consumerResponseArticleBought();
consumerReportServer();
consumerAllReviewArticle();
logoutSession();

//Inicio instancia de express
const app = initExpress(config);


//Levanto instancia de server
app.listen(PORT, () => {
    console.log("Listen on the port", PORT)
})