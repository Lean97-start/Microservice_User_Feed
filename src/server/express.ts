"use strict";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Config } from "../Config/Environments";
import { validationToken } from "../Middleware/Token";
import { router } from "./Routes";
import {IUserReq} from '../Interface/UserReq.Interface'

export function initExpress(appConfig: Config): express.Express {
  const app = express();

  app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true })); //Habilitamos los cors.
  app.use(morgan("dev")); 
  app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(validationToken);  
  app.use(router); //Llamamos a las rutas.

  return app;
}
