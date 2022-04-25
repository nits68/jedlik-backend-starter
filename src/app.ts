import * as express from "express";
import * as mongoose from "mongoose";
import IController from "./interfaces/controller.interface";
import loggerMiddleware from "./middleware/logger.middleware";
import onesideModel from "./controllers/oneside.model";
import nsideModel from "./controllers/nside.model";
// import * as cors from "cors";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.app.use(express.json());
        // Enabled CORS:
        // this.app.use(cors());
        this.app.use(loggerMiddleware);
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    public listen(): void {
        this.app.listen(5000, () => {
            console.log(`App listening on the port 5000`);
        });
    }

    private connectToTheDatabase() {
        // Connect to localhost:27017, create "AdatbázisNeve" database if not exist:
        mongoose.connect("mongodb://localhost:27017/AdatbázisNeve", err => {
            if (err) {
                console.log("Unable to connect to the server. Please start MongoDB.");
            }
        });

        mongoose.connection.on("error", error => {
            console.log(`Mongoose error message: ${error.message}`);
        });
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB server.");
        });

        onesideModel.init(); // for populate
        nsideModel.init();
    }
}
