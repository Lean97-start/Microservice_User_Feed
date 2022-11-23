'use strict';

import {connect} from 'mongoose';
import { Config } from './Environments';

export async function connectDBMongo(env: Config): Promise<void>{ //Realizo la conexión a mongo.
    await connect(env.mongoDb);
}