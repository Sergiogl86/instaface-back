import Debug from "debug";

import chalk from "chalk";

import mongoose from "mongoose";

const debug = Debug("instaface:indexServer");

const initializeMongoDBServer = (connectionString: string) =>
  new Promise<void>((resolve, reject) => {
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("No se ha conectado a BD - ಥ╭╮ಥ"));
        debug(chalk.red(error.message));
        reject(error);
        return;
      }
      debug(chalk.green("Conectado a BD - ᕦ( ͡° ͜ʖ ͡°)ᕤ"));
      resolve();
    });
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc: any, ret: { _id: any }) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
      },
    });
  });

export default initializeMongoDBServer;
