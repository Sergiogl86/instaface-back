import * as express from "express";

import chalk from "chalk";

import Debug from "debug";

import Message from "../../database/models/message";

import Picture from "../../database/models/picture";

import { RequestAuth } from "../../database/namespaces/expressNamespace";

import MessageInterface from "../../database/interfaces/messageInterface";

const debug = Debug("instaface:messageController");

class ErrorCode extends Error {
  code: number | undefined;
}

const addMessage = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  const message: MessageInterface = {
    messageText: req.body.messageText,
    pictureId: req.body.pictureId,
    userId: req.userid,
  };
  debug(chalk.blue("Ha accedido el usuario ->"));
  debug(chalk.blue(req.userid));
  debug(chalk.blue("Haciendo un post a /instaface/message/crear"));
  debug(chalk.blue("Nos llega en el body el message ->"));
  debug(chalk.blue(JSON.stringify(message)));
  try {
    const messageCreado: MessageInterface = await Message.create(message);
    debug(chalk.blue("Se ha creado el message ->"));
    debug(chalk.blue(JSON.stringify(messageCreado)));

    const buscarPicture: any = await Picture.findById(message.pictureId);

    debug(chalk.blue("Se añade a la Picture->"));
    debug(chalk.blue(JSON.stringify(buscarPicture)));
    // eslint-disable-next-line no-underscore-dangle
    buscarPicture.messageId.push(messageCreado._id);
    await buscarPicture.save();

    res.json({ message: "Creado correctamente!" });
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

const deleteMessage = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  debug(chalk.blue("Haciendo un delete a /instaface/message/borrar"));
  debug(chalk.blue("req.userid"));
  debug(chalk.blue(req.userid));
  const { messageId } = req.body;
  try {
    const message: any = await Message.findById(messageId);
    debug(chalk.blue("message.userId"));
    debug(chalk.blue(message.userId));
    if (message.userId.equals(req.userid)) {
      const removeMessage = await Message.findOneAndDelete({ _id: messageId });
      debug(chalk.blue("removeMessage"));
      debug(chalk.blue(removeMessage));

      const buscarPicture: any = await Picture.findById(message.pictureId);

      debug(chalk.blue("Se borra de la Picture->"));
      debug(chalk.blue(JSON.stringify(buscarPicture)));
      // eslint-disable-next-line no-underscore-dangle
      buscarPicture.messageId.remove(message._id);
      await buscarPicture.save();

      res.json({ message: "Mensaje borrado!" });
    } else {
      const error = new ErrorCode("El Mensaje no pertece al user!");
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

export { addMessage, deleteMessage };
