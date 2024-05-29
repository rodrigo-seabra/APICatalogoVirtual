import { Router } from "express";
import UserController from "../controllers/UserController";
import Middlewares from "../middlewares/Middlewares";

class Routes {
  public routes: Router;
  public constructor() {
    this.routes = Router();
    this.UserRoutes();
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
}
export default new Routes().routes;
