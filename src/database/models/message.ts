import { Schema, model, Types } from "mongoose";
import MessageInterface from "../interfaces/messageInterface";

const messageSchema: Schema<MessageInterface> = new Schema({
  messageText: {
    type: String,
    maxLength: 100,
    required: true,
  },
  pictureId: {
    type: Types.ObjectId,
    ref: "Picture",
    required: true,
  },
  messageDate: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Message = model<MessageInterface>(
  "Message",
  messageSchema,
  "comentarios"
);

export default Message;
