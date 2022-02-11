import * as express from "express";

import chalk from "chalk";

import Debug from "debug";
import jwt from "jsonwebtoken";
import { RequestAuth } from "../../database/namespaces/expressNamespace";

const debug = Debug("instaface:Auth");

class ErrorCode extends Error {
  code: number | undefined;
}

const Auth = (
  req: RequestAuth,
  res: express.Response,
  next: express.NextFunction
) => {
  debug(chalk.yellow("loginAuth queteca"));

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    debug(chalk.yellow("falta authHeader"));
    const error = new ErrorCode("No estas registrado");
    error.code = 401;
    next(error);
  } else {
    debug(chalk.yellow("correcto authHeader"));
    const token = authHeader.split(" ")[1];
    debug(chalk.yellow(`El Token ${token}`));
    if (!token) {
      debug(chalk.yellow("Token incorrecto"));
      const error = new ErrorCode("Necesario token!");
      error.code = 401;
      next(error);
    } else {
      debug(chalk.yellow("Token recogido"));
      try {
        const user: any = jwt.verify(token, `${process.env.RED_HASH}`);
        debug(chalk.blue(`Codificando en Token: ${JSON.stringify(user)}`));
        debug(chalk.blue(`Codificando en Auth: ${user.id}`));
        debug(chalk.blue(`Codificando en Auth: user.isAdmin`));
        req.userid = user.id;
        debug(chalk.yellow("Token correcto"));
        next();
      } catch {
        debug(chalk.yellow("Token incorrecto"));
        const error = new ErrorCode("Token incorrecto");
        error.code = 401;
        next(error);
      }
    }
  }
};

export default Auth;
