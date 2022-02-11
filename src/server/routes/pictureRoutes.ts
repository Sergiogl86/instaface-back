import express from "express";
import multer from "multer";
import path from "path";
import { addPicture, deletePicture } from "../controller/pictureController";

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

router.post("/publicar", upload.single("picture"), firebase, Auth, addPicture);
router.post("/borrar", Auth, deletePicture);

export default router;
