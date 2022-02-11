import * as express from "express";

import chalk from "chalk";

import Debug from "debug";

import User from "../../database/models/user";
import Picture from "../../database/models/picture";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

import UserInterface from "../../database/interfaces/userInterface";
import PictureInterface from "../../database/interfaces/pictureInterface";

const debug = Debug("instaface:recetaController");

class ErrorCode extends Error {
  code: number | undefined;
}

const addPicture = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  const picture: PictureInterface = {
    description: req.body.description,
    urlPicture: req.file.fileURL,
    pictureUser: req.userid,
  };
  debug(chalk.blue("Ha accedido el usuario ->"));
  debug(chalk.blue(req.userid));
  debug(chalk.blue("Haciendo un post a /instaface/picture/crear"));
  debug(chalk.blue("Nos llega en el body la picture ->"));
  debug(chalk.blue(JSON.stringify(picture)));
  try {
    const pictureCreada: PictureInterface = await Picture.create(picture);
    debug(chalk.blue("Se ha creado la picture ->"));
    debug(chalk.blue(JSON.stringify(pictureCreada)));
    res.json({ receta: "Creada correctamente!" });
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

export { addPicture };
