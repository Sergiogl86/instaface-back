import express from "express";
import multer from "multer";
import path from "path";

import { addUser, loginUser } from "../controller/usersController";

import firebase from "../middlewares/firebase";

const upload = multer({
  storage: multer.diskStorage({
    destination: "IMG_USER",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const oldFilenameWithoutExtension = oldFilename.replace(
        oldFilenameExtension,
        ""
      );

      const newFilename = `instaface-User-${oldFilenameWithoutExtension}-${Date.now()}-${oldFilenameExtension}`;

      callback(null, newFilename);
    },
  }),
});

const router = express.Router();

router.post("/register", upload.single("userImg"), firebase, addUser);

router.post("/login", loginUser);

export default router;
