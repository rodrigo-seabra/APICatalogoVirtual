import { json, Request, Response } from "express";
import Products from "../models/Products";
import bcrypt from "bcrypt";
import Token from "../helpers/Token";

class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const product = await Products.find().sort("-createdAt");
    return res.status(200).json(product);
  }
}

export default new ProductsController();
