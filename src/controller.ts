import { Request, Response, Router } from "express";
import IController from "./interfaces";
import { oneSideModel, manySideModel } from "./models";
import mongoose from "mongoose";

export default class myController implements IController {
    public router = Router();
    private one = oneSideModel;
    private many = manySideModel;

    constructor() {
        // Exam routes:

        // One-side example routes:
        this.router.get("/api/xyzOne", this.getOneAll);
        this.router.post("/api/xyzOne", this.createOne);
        this.router.delete("/api/xyzOne/:id", this.deleteOne);
        this.router.delete("/api/xyzOne/transaction/:id", this.deleteOneWithTransaction);

        // Many-side example routes:
        this.router.get("/api/xyzMany", this.getManyAll);
        this.router.get("/api/xyzMany/:id", this.getManyById);
        this.router.get("/api/xyzMany/keyword/:keyword", this.getManyByKeyword);
        this.router.get("/api/xyzMany-Group-By", this.getGroupByExample);
        this.router.get(`/api/xyzMany/:offset/:limit/:sortingfield/:filter?`, this.getManyPaginated);
        this.router.post("/api/xyzMany", this.createMany);
        this.router.patch("/api/xyzMany/:id", this.modifyManyPATCH);
        this.router.put("/api/xyzMany/:id", this.modifyManyPUT);
        this.router.delete("/api/xyzMany/:id", this.deleteMany);
    }

    // Exam handlers ***********************************************

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

    private createOne = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            // with _id "auto increment" sulution:
            let autoId: number = 1;
            const oneAll = await this.one.find();
            if (oneAll.length > 0) {
                autoId = Math.max(...oneAll.map(d => d._id as number)) + 1;
            }
            const createdDocument = new this.one({
                _id: autoId,
                ...body,
            });

            const savedDocument = await createdDocument.save();
            res.status(201).send(savedDocument);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private deleteOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            // Check if document has reference in manySide table:
            const refDocuments = await this.many.findOne({ FK_neve: id });
            if (refDocuments) {
                res.status(403).send({ message: `Document with id ${id} has reference in manySide table!` });
            } else {
                const successResponse = await this.one.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(204);
                } else {
                    res.status(404).send({ message: `Document with id ${id} not found!` });
                }
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private deleteOneWithTransaction = async (req: Request, res: Response) => {
        // deletOne with cascade delete in manySide table and transaction handling

        // Init transaction:
        const session = await mongoose.startSession();
        session.startTransaction(); 
        
        try {
            const id = req.params.id;
            await this.one.findByIdAndDelete(id).session(session);
            await this.many.deleteMany({ FK_neve: id }).session(session);
            // if no error in delete commands, commit transaction:
            await session.commitTransaction();
            res.sendStatus(204);
        } catch (error) {
            // Rollback transaction:
            await session.abortTransaction();
            res.status(400).send({ message: error.message });
        } finally {
            session.endSession();
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
                    $lookup: { from: "TáblaNeveOne", foreignField: "_id", localField: "FK_neve", as: "as_FK_neve" },
                    // from: The name of the oneSide table (not the model's name)!!!
                    // foreignField: Linking field of oneSide table (here the PK: _id)
                    // localField: Linking field of manySide table (here the FK: FK_neve)
                    // as: alias name, here "as_FK_neve", but it can be anything you like
                },
                {
                    $match: { $or: [{ "as_FK_neve.field1": myRegex }, { description: myRegex }] },
                    // $match: { "FK_neve.field1": req.params.keyword },
                },
                {
                    // convert array of objects to simple array (alias name):
                    $unwind: "$as_FK_neve",
                },
                // { $addFields: { "newField": "$as_FK_neve.oldField" },
                { $project: { _id: 0, prepTime: 0, "as_FK_neve._id": 0 } },
            ]);
            res.send(data);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getGroupByExample = async (req: Request, res: Response) => {
        try {
            const result = await manySideModel.aggregate([
                // Összekapcsolás (FROM - JOIN)
                {
                    $lookup: {
                        from: "TáblaNeveOne", // Az 1-oldali kollekció neve
                        localField: "FK_neve", // Az N-oldali kollekció kapcsolatot tartó mezője
                        foreignField: "_id", // Az 1-oldali kollekció kapcsolatot tartó mezője
                        as: "oneSideData", // Az új mező neve (álneve)
                    },
                },
                {
                    $unwind: "$oneSideData", // oneSideData új mező "laposítása" (az egy elemű tömbből "kiveszi" az objektumot)
                },
                // Szűrés a csoportosítás előtt (WHERE)
                {
                    $match: {
                        $and: [
                            { "oneSideData.field1": /alue/i }, // Szűrés a field1 mező alapján (itt regex mintával, https://regex101.com/)
                            { prepTime: { $gte: 10 } }, // Elkészítési idő >= 10
                        ],
                    },
                },
                // Csoportosítás (GROUP BY)
                {
                    $group: {
                        _id: "$oneSideData.field1", // Csoportok létrehozása a field1 mező azonos értékei alapján történik
                        avgPrepTime: { $avg: "$prepTime" }, // Átlagos elkészítési idő - AVG()
                        totalRecipes: { $sum: 1 }, // Receptek száma - COUNT()
                    },
                },
                // Szűrés a csoportosítás után (HAVING)
                {
                    $match: {
                        avgPrepTime: { $gte: 10 }, // Csak azok a csoportok, ahol az átlagos elkészítési idő >= 10
                    },
                },
                // Rendezés (ORDER BY)
                {
                    $sort: {
                        avgPrepTime: 1, // Növekvő sorrend az átlagos elkészítési idő szerint (-1 esetén csökkenő sorrend)
                    },
                },
                // Limitálás (LIMIT)
                {
                    $limit: 3, // Maximum 3 dokumentumot ad vissza
                },
                // Kiválasztás (SELECT, projekció)
                {
                    $project: {
                        _id: 0, // Ne adja vissza az _id mezőt (mező átnevezése 1.)
                        field1Custom: "$_id", // Az új mező neve az _id helyett "field1Custom" (mező átnevezése 2.)
                        avgPrepTime: 1, // Átlagos elkészítési idő (1: megjelenítés, 0: elrejtés)
                        totalRecipes: 1, // Receptek száma
                    },
                },
            ]);
            res.send(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred!!" });
            }
        }
    };

    private getManyPaginated = async (req: Request, res: Response) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const sortingfield = req.params.sortingfield; // with "-" prefix made DESC order
            let paginatedData = [];
            let count = 0;
            if (req?.params?.filter != "") {
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
