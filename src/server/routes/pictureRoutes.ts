import express from "express";
import multer from "multer";
import path from "path";
import {
  allPictures,
  addPicture,
  deletePicture,
  userPictures,
  allPicturesMessages,
  userPicturesMessages,
  allPicturesNoMessages,
  userPicturesNoMessages,
} from "../controller/pictureController";

import Auth from "../middlewares/auth";

import firebase from "../middlewares/firebase";

const upload = multer({
  storage: multer.diskStorage({
    destination: "IMG_PICTURE",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const oldFilenameWithoutExtension = oldFilename.replace(
        oldFilenameExtension,
        ""
      );

      const newFilename = `instaface-Picture-${oldFilenameWithoutExtension}-${Date.now()}-${oldFilenameExtension}`;

      callback(null, newFilename);
    },
  }),
});

const router = express.Router();

router.get("/all", allPictures);
router.get("/allMessage", allPicturesMessages);
router.get("/allNoMessage", allPicturesNoMessages);

router.get("/user", Auth, userPictures);
router.get("/userMessage", Auth, userPicturesMessages);
router.get("/userNoMessage", Auth, userPicturesNoMessages);

router.post("/publicar", upload.single("picture"), firebase, Auth, addPicture);
router.post("/borrar", Auth, deletePicture);

export default router;
