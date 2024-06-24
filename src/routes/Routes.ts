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
    this.routes.get(
      "/products/userproducts",
      ProductsController.getAllUserProducts
    );
    this.routes.get(
      "/products/userintention",
      Middlewares.authMiddleware,
      ProductsController.getAllUserIntention
    );

    this.routes.get(
      "/products/userbuy",
      Middlewares.authMiddleware,
      ProductsController.getAllUserBuy
    );

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

    this.routes.patch(
      "/products/edit/:id",
      Middlewares.authMiddleware,
      Middlewares.imageUpload.array("images"),
      ProductsController.update
    );

    this.routes.patch(
      "/products/schedule/:id",
      Middlewares.authMiddleware,
      ProductsController.schedule
    );
    this.routes.patch(
      "/producst/conclude/:id",
      Middlewares.authMiddleware,
      ProductsController.concludeTransfer
    );
  }
}
export default new Routes().routes;
