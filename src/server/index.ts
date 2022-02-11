import cors from "cors";
import chalk from "chalk";
import Debug from "debug";

import morgan from "morgan";

import express from "express";
import { noEncontradoHandler, finalErrorHandler } from "./middlewares/error";

import usersRoutes from "./routes/usersRoutes";

import pictureRoutes from "./routes/pictureRoutes";

const debug = Debug("instaface:indexServer");

const app = express();

const initializeServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.bgGreen.white(
          `Servidor ejecutada OK y escuchando el puerto ${port} ${"ᕦ( ͡° ͜ʖ ͡°)ᕤ"}`
        )
      );
      resolve(server);
    });

    server.on("error", (error: { code: string }) => {
      debug(
        chalk.bgRed.white(
          "Ha habido un problema inicializando el servidor ಥ╭╮ಥ"
        )
      );
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRed.white(`El puerto ${port} está en uso ಥ╭╮ಥ`));
      }
      reject();
    });

    server.on("close", () => {
      debug(
        chalk.bgBlue.white(
          "Se ha desconectado el servidor correctamente ( ͡° ͜ʖ ͡°)"
        )
      );
    });
  });

app.use(morgan("dev"));

app.use(cors()); // <---- use cors middleware

app.use(express.json());

app.use("/instaface/users/", usersRoutes);

app.use("/instaface/picture/", pictureRoutes);

app.use(noEncontradoHandler);
app.use(finalErrorHandler);

export { initializeServer, app };
