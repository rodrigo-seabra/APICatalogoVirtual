import { json, Request, Response } from "express";
import Products, { ProductsModel } from "../models/Products";
import bcrypt from "bcrypt";
import Token from "../helpers/Token";
import { UsersModel } from "../models/Users";

class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const product = await Products.find().sort("-createdAt");
    return res.status(200).json(product);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    let user: UsersModel = await Token.getUser(req, res);
    let owner = {
      id: user._id,
      name: user.name,
      CPF: user.CPF,
    } as UsersModel;
    console.log(owner);
    let { name, category, modelVehicle, year, brand, description } =
      req.body as ProductsModel;
    if (
      !name ||
      !category ||
      !modelVehicle ||
      !year ||
      !brand ||
      !description
    ) {
      return res
        .status(422)
        .json({ message: "Ausência de dados obrigatórios" });
    }
    year = Number(year);
    if (
      !Number.isInteger(year) ||
      year < 1886 ||
      year > new Date().getFullYear()
    ) {
      console.log(typeof year);
      return res.status(400).json({ message: "Ano do veículo inválido" });
    }
    let status = "available";
    if (req.body.status == "sold" || req.body.status == "pending") {
      status = req.body.status;
    }
    let images = req.files || [];
    if (images && images.length === 0) {
      return res.status(422).json({ message: "A imagem é obrigatória" });
    }

    const product = new Products({
      owner,
      name,
      category,
      modelVehicle,
      year,
      brand,
      description,
      status,
      images: [],
    });

    if (Array.isArray(images)) {
      images.forEach((image) => {
        product.images!.push(image.filename);
      });
    } else {
      return res.status(500).json({ message: "Sever error" });
    }

    try {
      let newProduct = await product.save();
      return res
        .status(200)
        .json({ message: "Produto cadastrado com sucesso!", newProduct });
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
}

export default new ProductsController();
