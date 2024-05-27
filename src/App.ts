import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import Routes from "./routes/Routes";
import mongoose from "mongoose";

class App {
  public express: express.Application;
  public constructor() {
    this.express = express();
    this.database();
    this.middleware();
    this.routes();
    this.express.listen(80);
  }
  private middleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private database(): void {
    mongoose.set("strictQuery", false);
    mongoose.connect(
      "mongodb://rodrigoseabra06:BUhpIZm1vhUnGc6A@ac-avr72uq-shard-00-00.lm62pjb.mongodb.net:27017,ac-avr72uq-shard-00-01.lm62pjb.mongodb.net:27017,ac-avr72uq-shard-00-02.lm62pjb.mongodb.net:27017/?ssl=true&replicaSet=atlas-zg21ik-shard-0&authSource=admin&retryWrites=true&w=majority&appName=testesNode"
    );
  }
  private routes(): void {
    this.express.use(Routes);
  }
}

export default new App().express;
