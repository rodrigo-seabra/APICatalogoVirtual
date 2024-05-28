import { NextFunction, Request, Response } from "express";
import Token from "../helpers/Token";

import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";

class Middlewares {
  private imageStorage: StorageEngine;
  public imageUpload: multer.Multer;

  constructor() {
    this.imageStorage = multer.diskStorage({
      destination: this.setDestination,
      filename: this.setFilename,
    });

    this.imageUpload = multer({
      storage: this.imageStorage,
      fileFilter: this.fileFilter,
    });
  }

  private setDestination(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void {
    let folder = "";
    if (req.url.includes("/user")) {
      folder = "users";
    } else {
      folder = "product";
    }

    cb(null, `public/images/${folder}/`);
  }

  private setFilename(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(null, true);
  }

  public async authMiddleware(req: Request, res: Response, next: NextFunction) {
    let token = Token.getToken(req);
    if (token == "Sem credenciais") {
      return res.status(401).json({ message: "Acesso negado!" });
    }
    let authToken = await Token.check(token);
    if (authToken) {
      next();
    } else {
      return res.status(400).json({ message: "Token inválido!" });
    }
  }
}

export default new Middlewares();

function getErrorMessage(err: unknown) {
  throw new Error("Function not implemented");
}
