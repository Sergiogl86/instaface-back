import * as express from "express";

import chalk from "chalk";

import bcrypt from "bcrypt";

import Debug from "debug";
// import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import UserInterface from "../../database/interfaces/userInterface";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

const debug = Debug("instaface:usersController");

class ErrorCode extends Error {
  code: number | undefined;
}

const addUser = async (req: RequestAuth, res: express.Response, next: any) => {
  const userBody = req.body;
  debug(chalk.blue("Nos llega en el file el user ->"));
  userBody.urlFotoUser = req.file.fileURL;
  debug(chalk.blue(JSON.stringify(userBody)));
  debug(chalk.blue("Haciendo un post a instaface/users/register"));
  debug(chalk.blue("Nos llega en el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  userBody.password = await bcrypt.hash(userBody.password, 10);
  debug(chalk.blue("Modifico el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  try {
    debug(
      chalk.blue("Creando usuario en el endpoint /instaface/users/register")
    );
    const users: UserInterface = await User.create(userBody);
    debug(chalk.blue(`Hemos creado el usuario ${users}`));
    res.json({ user: "Creado correctamente!" });
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 400;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

export { addUser };
