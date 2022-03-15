import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import recipeModel from "./recipe.model";

export default class recipeController implements Controller {
    public path = "/recipe";
    public router = Router();
    private recipeM = recipeModel;

    constructor() {
        this.router.post(this.path, this.create);
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.patch(`${this.path}/:id`, this.modify);
        this.router.delete(`${this.path}/:id`, this.delete);
    }

    private create = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.recipeM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.recipeM.find().populate("author", "-_id name");
            res.send(data);
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.recipeM.findById(id).populate("author", "-_id name");
            if (document) {
                res.send(document);
            } else {
                res.status(404);
                res.send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private modify = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const updatedDoc = await this.recipeM.findByIdAndUpdate(id, body, { new: true }).populate("author", "-_id name");
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                res.status(404);
                res.send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.recipeM.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                res.status(404);
                res.send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };
}
