import { Schema, model, Document } from "mongoose";
import { UsersInterface } from "../interfaces/Users.interface";

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
export interface UsersModel extends UsersInterface, Document {}
export default model<UsersModel>("User", UsersSchema);
