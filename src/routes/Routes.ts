import { Router } from "express";
import UserController from "../controllers/UserController";
import Middlewares from "../middlewares/Middlewares";
import ProductsController from "../controllers/ProductsController";

class Routes {
  public routes: Router;
  public constructor() {
    this.routes = Router();
    this.UserRoutes();
    this.ProductsRoutes();
  }

  private UserRoutes() {
    this.routes.post(
      "/user",
      Middlewares.imageUpload.single("image"),
      UserController.store
    );
    this.routes.post("/user/login", UserController.login);
    this.routes.patch(
      "/user/update/:id",
      Middlewares.authMiddleware,
      Middlewares.imageUpload.single("image"),
      UserController.update
    );
    this.routes.delete(
      "/user/delete/:id",
      Middlewares.authMiddleware,
      UserController.delete
    );
  }

  private ProductsRoutes() {
    this.routes.get("/products/getall", ProductsController.index);
    this.routes.get("/products/get/:id", ProductsController.getById);
    this.routes.delete(
      "/products/delete/:id",
      Middlewares.authMiddleware,
      ProductsController.delete
    );

    this.routes.post(
      "/products/store",
      Middlewares.authMiddleware,
      Middlewares.imageUpload.array("images"),
      ProductsController.store
    );
  }
}
export default new Routes().routes;
