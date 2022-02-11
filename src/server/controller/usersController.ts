import * as express from "express";

import chalk from "chalk";

import bcrypt from "bcrypt";

import Debug from "debug";
import jwt from "jsonwebtoken";
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

const loginUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const { nombreUsuario, password } = req.body;
  debug(chalk.blue("Haciendo un post a /queteca/users/login"));
  debug(chalk.blue("loginUser"));
  debug(chalk.blue(nombreUsuario));
  debug(chalk.blue(password));
  const user: UserInterface | null = await User.findOne({ nombreUsuario });
  debug(chalk.blue(`El usuario encontrado es ${JSON.stringify(user)}`));
  debug(chalk.blue(user));
  if (!user) {
    const error = new ErrorCode("Error de credenciales!");
    error.code = 401;
    debug(chalk.blue(`El usuario no existe ${JSON.stringify(error)}`));
    next(error);
  } else {
    const contraseñaOK = await bcrypt.compare(password, user.password);
    debug(chalk.blue(contraseñaOK));
    if (!contraseñaOK) {
      const error = new ErrorCode("Error de credenciales!");
      error.code = 401;
      next(error);
    } else {
      debug(chalk.blue("Seguimos para generar el Token!"));
      debug(chalk.blue(`Codificando: ${user.id}`));
      debug(chalk.blue(`Codificando: ${user.nombreUsuario}`));
      const token = jwt.sign(
        {
          id: user.id,
          nombre: user.nombre,
          nombreUsuario: user.nombreUsuario,
          urlFotoUser: user.urlFotoUser,
        },
        `${process.env.RED_HASH}`,
        {
          expiresIn: 24 * 60 * 60,
        }
      );
      res.json({ token });
    }
  }
};

export { addUser, loginUser };
