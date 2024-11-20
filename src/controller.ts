import { Request, Response, Router } from "express";
import IController from "./interfaces";
import { oneSideModel, manySideModel } from "./models";

export default class myController implements IController {
    public router = Router();
    private one = oneSideModel;
    private many = manySideModel;

    constructor() {
        // One-side example routes:
        this.router.get("/api/xyzOne", this.getOneAll);

        // Many-side example routes:
        this.router.get("/api/xyzMany/:id", this.getManyAll);
        // this.router.get("/api/xyzMany/:id", this.getManyById);
        this.router.get("/api/xyzMany/keyword/:keyword", this.getManyByKeyword);
        this.router.get(`/api/xyzMany/:offset/:limit/:sortingfield/:filter?`, this.getManyPaginated);
        this.router.post("/api/xyzMany", this.createMany);
        this.router.patch("/api/xyzMany/:id", this.modifyManyPATCH);
        this.router.put("/api/xyzMany/:id", this.modifyManyPUT);
        this.router.delete("/api/xyzMany/:id", this.deleteMany);
    }

    // One-side handlers *********************************************
    private getOneAll = async (req: Request, res: Response) => {
        try {
            const data = await this.one.find();
            // or:
            // const data = await this.one.find().populate("virtualPop");
            res.send(data);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    // Many-side handlers *********************************************
    private getManyAll = async (req: Request, res: Response) => {
        try {
            const data = await this.many.find().populate("FK_neve");
            // or:
            // const data = await this.many.find().populate("virtualPop");
            res.send(data);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getManyById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.many.findById(id).populate("FK_neve", "-_id");
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getManyByKeyword = async (req: Request, res: Response) => {
        // Example of filtering in both side:
        try {
            const myRegex = new RegExp(req.params.keyword, "i"); // "i" for case-insensitive

            // SQL to Aggregation samples:
            // https://www.mongodb.com/docs/manual/reference/sql-aggregation-comparison/
            // https://www.mongodb.com/docs/manual/tutorial/aggregation-zip-code-data-set/
            // https://www.practical-mongodb-aggregations.com/

            const data = await this.many.aggregate([
                {
                    $lookup: { from: "TáblaNeveOne", foreignField: "_id", localField: "FK_neve", as: "FK_neve" },
                    // from: The name of the one-side collection!!!
                    // foreignField: Linking field of one-side collection (here the PK: _id)
                    // localField: Linking field of n-side collection (here the FK: FK_neve)
                    // as: alias name, here "FK_neve", but it can be anything you like
                },
                {
                    $match: { $or: [{ "FK_neve.field1": myRegex }, { description: myRegex }] },
                    // $match: { "FK_neve.field1": req.params.keyword },
                },
                {
                    // convert array of objects to simple array (alias name):
                    $unwind: "$FK_neve",
                },
                { $project: { _id: 0, prepTime: 0, "FK_neve._id": 0 } },
            ]);
            res.send(data);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getManyPaginated = async (req: Request, res: Response) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const sortingfield = req.params.sortingfield; // with "-" prefix made DESC order
            let paginatedData = [];
            let count = 0;
            if (req.params.filter && req.params.filter != "") {
                const myRegex = new RegExp(req.params.filter, "i"); // i for case insensitive
                count = await this.many.find({ $or: [{ name: myRegex }, { description: myRegex }] }).countDocuments();
                paginatedData = await this.many
                    .find({ $or: [{ name: myRegex }, { description: myRegex }] })
                    .sort(sortingfield)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.many.countDocuments();
                paginatedData = await this.many.find({}).sort(sortingfield).skip(offset).limit(limit);
            }
            res.append("x-total-count", `${count}`); // append total count of documents to response header
            res.send(paginatedData);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private createMany = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.many({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private modifyManyPATCH = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const updatedDoc = await this.many.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("FK_neve", "-_id");
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private modifyManyPUT = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.many.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.many.findById(id).populate("FK_neve", "-_id");
                res.send(updatedDoc);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private deleteMany = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.many.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
