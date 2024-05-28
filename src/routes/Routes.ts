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
    this.routes.post("/login", UserController.login);
    this.routes.patch(
      "/update",
      Middlewares.authMiddleware,
      Middlewares.imageUpload.single("image"),
      UserController.update
    );
  }
}
export default new Routes().routes;
