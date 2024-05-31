import { Schema, model, Document } from "mongoose";
import { ProductsInterface } from "../interfaces/Products.interface";

const ProductsSchema: Schema = new Schema({
  owner: Object,
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  modelVehicle: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold", "pending"],
    required: true,
  },
  buyer: { type: Object, equired: false },
});
export interface ProductsModel extends ProductsInterface, Document {}
export default model<ProductsModel>("Products", ProductsSchema);