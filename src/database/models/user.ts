import { Schema, model } from "mongoose";
import UserInterface from "../interfaces/userInterface";

const userSchema: Schema<UserInterface> = new Schema({
  nombre: {
    type: String,
    maxLength: 15,
    required: true,
  },
  nombreUsuario: {
    type: String,
    maxLength: 15,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  urlFotoUser: {
    type: String,
    required: true,
  },
});

const User = model<UserInterface>("User", userSchema, "usuarios");

export default User;
