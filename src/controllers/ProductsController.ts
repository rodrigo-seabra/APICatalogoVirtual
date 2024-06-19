import { json, Request, Response } from "express";
import Products, { ProductsModel } from "../models/Products";
import bcrypt from "bcrypt";
import Token from "../helpers/Token";
import { UsersModel } from "../models/Users";
import { isValidObjectId, ObjectId } from "mongoose";

class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const product = await Products.find().sort("-createdAt");
    return res.status(200).json(product);
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const id: string = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(422).json({ message: "Id inválido" });
    }
    const product: ProductsModel | null = await Products.findOne({
      _id: id,
    });
    if (!product) {
      return res.status(404).json({ message: "produto não encontrado!" }); //404 - recurso não existe
    } else {
      return res.status(200).json({
        product: product,
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const id: string = req.params.id;
    let user: UsersModel = await Token.getUser(req, res);
    let updateData = {} as ProductsModel;
    let { name, category, modelVehicle, year, brand, description } =
      req.body as ProductsModel;
    const images = req.files as Express.Multer.File[];
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
    } else {
      updateData.name = name;
      updateData.category = category;
      updateData.modelVehicle = modelVehicle;
      updateData.year = year;
      updateData.brand = brand;
      updateData.description = description;
    }
    if (images?.length === 0) {
      return res
        .status(422)
        .json({ message: "Ausência de dados obrigatórios" });
    } else {
      updateData.images = [];
      images?.map((image: any) => {
        updateData.images?.push(image.filename);
      });
    }

    try {
      const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar o produto", error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    let user: UsersModel = await Token.getUser(req, res);
    const id: string = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(422).json({ message: "Id inválido" });
    }
    const product: ProductsModel | null = await Products.findOne({
      _id: id,
    });
    if (!product) {
      return res.status(404).json({ message: "produto não encontrado!" }); //404 - recurso não existe
    } else if (product._id?.toString() !== user._id?.toString()) {
      return res.status(422).json({
        message: "Houve um problema ao processar a sua solicitação!",
      });
    } else {
      try {
        await Products.findOneAndDelete({ _id: id });
        return res
          .status(200)
          .json({ message: "produto removido com sucesso!" });
      } catch (error: any) {
        return res.status(500).json({ message: error });
      }
    }
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
