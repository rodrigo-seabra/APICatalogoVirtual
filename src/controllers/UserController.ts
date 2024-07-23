import { json, Request, Response } from "express";
import Users from "../models/Users";
import bcrypt from "bcrypt";
import Token from "../helpers/Token";
import { UsersModel } from "../models/Users";

class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    let user: UsersModel = await Token.getUser(req, res);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    } else {
      return res.status(200).json({ user });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as UsersModel;
    let userFind: UsersModel | null = await Users.findOne({ email: email });
    if (userFind) {
      if (!email) {
        return res.status(422).json({ message: "O email é obrigatório!" });
      }
      if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória!" });
      }
      const checkPassword = await bcrypt.compare(password, userFind.password);
      if (!checkPassword) {
        return res.status(422).json({
          message: "Senha inválida",
        });
      }
      return await Token.createUserToken(userFind, res);
    } else {
      return res.status(422).json({
        message: "Não há usuário cadastrado com esse e-mail",
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      let user: UsersModel = await Token.getUser(req, res);
      const { password, confirmpassword } = req.body as UsersModel;
      if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória!" });
      } else if (!confirmpassword) {
        return res
          .status(422)
          .json({ message: "A senha de confirmaçãao é obrigatória!" });
      } else if (password !== confirmpassword) {
        return res.status(422).json({
          message: "A senha e a confirmação de senha precisam ser iguais!",
        });
      } else {
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          return res.status(422).json({
            message: "Senha inválida",
          });
        }
        await Users.findOneAndDelete({ CPF: user.CPF });
        return res
          .status(200)
          .json({ message: "Usuário removido com sucesso" });
      }
    } catch (err: any) {
      return res.status(500).json({ status: err.message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      let userFind: UsersModel | null = await Users.findOne({
        CPF: req.body.CPF,
      });
      if (!userFind) {
        let user = {
          CPF: req.body.CPF,
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          image: undefined,
          confirmpassword: req.body.confirmpassword,
        } as UsersModel;
        if (req.file) {
          user.image = req.file.filename;
        }
        if (!user.name) {
          return res.status(422).json({ message: "O nome é obrigatório!" });
        }
        if (!user.CPF) {
          return res.status(422).json({ message: "O CPF é obrigatório!" });
        }
        if (!user.email) {
          return res.status(422).json({ message: "O email é obrigatório!" });
        }
        if (!user.phone) {
          return res.status(422).json({ message: "O telefone é obrigatório!" });
        }
        if (!user.password) {
          return res.status(422).json({ message: "A senha é obrigatória!" });
        }
        if (!user.confirmpassword) {
          return res
            .status(422)
            .json({ message: "A senha de confirmaçãao é obrigatória!" });
        }
        if (user.password !== user.confirmpassword) {
          return res.status(422).json({
            message: "A senha e a confirmação de senha precisam ser iguais!",
          });
        }
        //CREATE A PASSWORD
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(user.password, salt);
        user.password = passwordHash;
        let created = await Users.create(user);
        return await Token.createUserToken(created, res);
      } else {
        throw new Error("Usuário já cadastrado");
      }
    } catch (err: any) {
      return res.json({ status: err.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    try {
      let user: UsersModel = await Token.getUser(req, res);
      const { name, email, phone, password, confirmpassword } =
        req.body as UsersModel;
      if (req.file) {
        user.image = req.file.filename;
      }
      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório!" });
      } else {
        user.name = name;
      }

      if (!email) {
        return res.status(422).json({ message: "O e-mail é obrigatório!" });
      } else {
        let userExists = await Users.findOne({
          email: email,
        });
        if (user.email !== email && userExists) {
          return res
            .status(422)
            .json({ message: "Por favor, utilize outro e-mail!" });
        } else {
          user.email = email;
        }
      }

      if (password === confirmpassword && password != null) {
        const salt = await bcrypt.genSalt(12); //12 caracteres a mais
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
      } else {
        return res.status(422).json({ message: "As senhas não conferem" });
      }
      let updatedUser = await Users.findOneAndUpdate(
        { CPF: user.CPF },
        { $set: user }, //os dados que serão atualizados
        { new: true } // parametros para atualizar os dados com sucesso
      );
      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso!", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  //TODO: criar método apenas para troca de senhas
}

export default new UserController();

function getErrorMessage(err: unknown) {
  throw new Error("Function not implemented");
}
