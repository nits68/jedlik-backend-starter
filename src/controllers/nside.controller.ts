import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import nsideModel from "./nside.model";

export default class nsideController implements Controller {
    public path = "/nside";
    public router = Router();
    private nsideM = nsideModel;

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
            const createdDocument = new this.nsideM({
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
            const data = await this.nsideM.find().populate("oneside", "-_id name");
            res.send(data);
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.nsideM.findById(id).populate("oneside", "-_id name");
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
            const updatedDoc = await this.nsideM.findByIdAndUpdate(id, body, { new: true }).populate("oneside", "-_id name");
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
            const successResponse = await this.nsideM.findByIdAndDelete(id);
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