import { Schema, model, Types } from "mongoose";
import PictureInterface from "../interfaces/pictureInterface";

const pictureSchema: Schema<PictureInterface> = new Schema({
  description: {
    type: String,
    maxLength: 100,
    required: true,
  },
  pictureDate: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageId: {
    type: [Types.ObjectId],
    ref: "Message",
    default: [],
  },
  urlPicture: {
    type: String,
    required: true,
  },
});

const Picture = model<PictureInterface>(
  "Picture",
  pictureSchema,
  "publicaciones"
);

export default Picture;
