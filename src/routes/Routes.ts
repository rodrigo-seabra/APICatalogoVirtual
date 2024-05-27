import { Router } from "express";
import UserController from "../controllers/UserController";
import RequestMiddlewares from "../middlewares/RequestMiddlewares";

class Routes {
  public routes: Router;
  public constructor() {
    this.routes = Router();
    this.UserRoutes();
  }
  private UserRoutes() {
    this.routes.get("/index", UserController.index);
    this.routes.post("/user", UserController.store);
    this.routes.post("/login", UserController.login);
    this.routes.patch(
      "/update",
      RequestMiddlewares.middleware,
      UserController.update
    );
  }
}
export default new Routes().routes;
