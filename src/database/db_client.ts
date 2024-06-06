import "reflect-metadata"
import { DataSource } from "typeorm"
import logger from "jet-logger"

export const AppDataSource = new DataSource(require('../../ormconfig.json'));

AppDataSource.initialize()
  .then(async () => logger.imp("MongoDB Database is connected!"))
  .catch((error) => logger.err(error));

