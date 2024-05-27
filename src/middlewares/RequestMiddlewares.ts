import { NextFunction, Request, Response } from "express";
import Token from "../helpers/Token";
import Users from "../models/Users";

class RequestMiddlewares {
  public async middleware(req: Request, res: Response, next: NextFunction) {
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

export default new RequestMiddlewares();
