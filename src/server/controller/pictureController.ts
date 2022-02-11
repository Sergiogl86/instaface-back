import * as express from "express";

import chalk from "chalk";

import Debug from "debug";

import Picture from "../../database/models/picture";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

import PictureInterface from "../../database/interfaces/pictureInterface";

const debug = Debug("instaface:pictureController");

class ErrorCode extends Error {
  code: number | undefined;
}

const allPictures = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/all"));
  try {
    const picture: PictureInterface[] = await Picture.find({})
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });
    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(picture));
    res.json(picture);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const allPicturesMessages = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/all"));
  try {
    const pictures: PictureInterface[] = await Picture.find({})
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });
    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(pictures));

    const picturesMessages: PictureInterface[] = pictures.filter(
      (picture: PictureInterface) => picture.messageId?.length > 0
    );

    res.json(picturesMessages);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const allPicturesNoMessages = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/all"));
  try {
    const pictures: PictureInterface[] = await Picture.find({})
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });
    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(pictures));

    const picturesMessages: PictureInterface[] = pictures.filter(
      (picture: PictureInterface) => picture.messageId?.length === 0
    );

    res.json(picturesMessages);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const addPicture = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  const picture: PictureInterface = {
    description: req.body.description,
    urlPicture: req.file.fileURL,
    userId: req.userid,
    messageId: [],
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
    res.json({ picture: "Creada correctamente!" });
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

const deletePicture = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un delete a /instaface/picture/borrar"));
  debug(chalk.blue("req.userid"));
  debug(chalk.blue(req.userid));
  const { pictureId } = req.body;
  try {
    const picture: any = await Picture.findById(pictureId);
    debug(chalk.blue("picture.pictureUser"));
    debug(chalk.blue(picture.pictureUser));
    if (picture.userId.equals(req.userid)) {
      const removePicture = await Picture.findOneAndDelete({ _id: pictureId });
      debug(chalk.blue("deletePicture"));
      debug(chalk.blue(removePicture));
      res.json({ picture: "Publicación borrada!" });
    } else {
      const error = new ErrorCode("La publicación no pertece al user!");
      error.code = 401;
      next(error);
    }
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

const userPictures = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/user"));
  debug(chalk.blue("req.userid"));
  debug(chalk.blue(req.userid));
  try {
    const pictures: PictureInterface[] = await Picture.find({
      userId: req.userid,
    })
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });

    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(pictures));
    res.json(pictures);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const userPicturesMessages = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/all"));
  try {
    const pictures: PictureInterface[] = await Picture.find({
      userId: req.userid,
    })
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });
    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(pictures));

    const picturesMessages: PictureInterface[] = pictures.filter(
      (picture: PictureInterface) => picture.messageId?.length > 0
    );

    res.json(picturesMessages);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const userPicturesNoMessages = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un get a /instaface/pictures/all"));
  try {
    const pictures: PictureInterface[] = await Picture.find({
      userId: req.userid,
    })
      .sort({ pictureDate: "desc" })
      .populate({
        path: "userId",
        select: "id nombreUsuario urlFotoUser",
      })
      .populate({
        path: "messageId",
        select: "messageText messageDate userId",
        options: { sort: { messageDate: "desc" } },
        populate: {
          path: "userId",
          select: "nombreUsuario urlFotoUser",
        },
      });
    debug(chalk.blue("Populate el picture->"));
    debug(chalk.blue(pictures));

    const picturesMessages: PictureInterface[] = pictures.filter(
      (picture: PictureInterface) => picture.messageId?.length === 0
    );

    res.json(picturesMessages);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new ErrorCode("Datos erroneos!");
    error.code = 401;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

export {
  allPictures,
  addPicture,
  deletePicture,
  userPictures,
  allPicturesMessages,
  userPicturesMessages,
  allPicturesNoMessages,
  userPicturesNoMessages,
};
