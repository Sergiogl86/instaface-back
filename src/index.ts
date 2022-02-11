import dotenv from "dotenv";

dotenv.config();

// eslint-disable-next-line import/first
import { initializeServer } from "./server/index";
// eslint-disable-next-line import/first
import initializeMongoDBServer from "./database/index";

dotenv.config();

const port = process.env.PORT || process.env.LOCAL_PORT || 5050;

(async () => {
  await initializeServer(+port);
  await initializeMongoDBServer(`${process.env.MONGODB_STRING}`);
})();
