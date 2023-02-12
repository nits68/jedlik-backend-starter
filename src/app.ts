import express from "express";
import mongoose from "mongoose";
import IController from "./interfaces/controller.interface";
import onesideModel from "./controllers/oneside.model";
import nsideModel from "./controllers/nside.model";
import morgan from "morgan";
// import cors from "cors";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.app.use(express.json());
        // Enabled CORS (don't forget to import cors):
        // this.app.use(cors());

        // morgan logger middleware for node.js
        // settings: https://github.com/expressjs/morgan#predefined-formats
        this.app.use(morgan(":method :url status=:status :date[clf] length=:res[content-length] time=:response-time ms"));

        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    public listen(): void {
        this.app.listen(5000, () => {
            console.log("App listening on the port 5000");
        });
    }

    private connectToTheDatabase() {
        mongoose.set("strictQuery", true); // for disable Deprecation Warning
        // Connect to localhost:27017, create "AdatbázisNeve" database if not exist:
        mongoose.connect("mongodb://127.0.0.1:27017/AdatbázisNeve", err => {
            if (err) {
                console.log("Unable to connect to the server. Please start MongoDB.");
            }
        });

        mongoose.connection.on("error", error => {
            console.log(`Mongoose error message: ${error.message}`);
        });
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB server.");
            this.listen();
        });

        // init models for populate
        onesideModel.init();
        nsideModel.init();
    }
}
