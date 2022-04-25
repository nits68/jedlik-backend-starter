import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import onesideModel from "./oneside.model";

export default class nsideController implements Controller {
    public path = "/api/xyz1";
    public router = Router();
    private onesideM = onesideModel;

    constructor() {
        this.router.get("/api/xyz1", this.getAll);
    }

    private getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.onesideM.find();
            res.send(data);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
