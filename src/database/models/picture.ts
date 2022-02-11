import { Schema, model, Types } from "mongoose";
import PictureInterface from "../interfaces/pictureInterface";

const recetaSchema: Schema<PictureInterface> = new Schema({
  description: {
    type: String,
    maxLength: 100,
    required: true,
  },
  pictureDate: {
    type: Date,
    default: Date.now(),
  },
  pictureUser: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  urlPicture: {
    type: String,
    required: true,
  },
  messagePicture: {
    type: String,
  },
});

const Picture = model<PictureInterface>(
  "Picture",
  recetaSchema,
  "publicaciones"
);

export default Picture;
