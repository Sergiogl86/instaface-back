import chalk from "chalk";

import Debug from "debug";

import admin from "firebase-admin";

const debug = Debug("instaface:filebase");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "instaface-back.appspot.com",
});

const firebase = async (req: any, res: any, next: any) => {
  try {
    const bucket = admin.storage().bucket();
    await bucket.upload(req.file.path);
    await bucket.file(req.file.filename).makePublic();
    const fileURL = bucket.file(req.file.filename).publicUrl();
    debug(chalk.green("Url de la imagen ->"));
    debug(chalk.green(fileURL));
    req.file.fileURL = fileURL;
    next();
  } catch {
    next();
  }
};

export default firebase;
