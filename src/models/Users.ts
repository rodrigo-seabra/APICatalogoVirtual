import { Schema, model, Document } from "mongoose";
import { UsersInterface } from "../interfaces/Users.interface";

interface UsersModel extends UsersInterface, Document {}
const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    CPF: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<UsersModel>("User", UsersSchema);
