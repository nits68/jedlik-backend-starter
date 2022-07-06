import { Schema, model } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

// ref: "onside" -> 1 oldali modell neve, nem kell átírni!

const nsideSchema = new Schema(
    {
        _id: Number,
        FK_neve: {
            ref: "oneside",
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        isGlutenFree: {
            type: Boolean,
            required: true,
        },
        prepTime: {
            type: Number,
            required: true,
        },
        minMaxExample: {
            type: Number,
            min: [1, "Too few stars, got {VALUE}"],
            max: [5, "Too many stars, got {VALUE}"],
            required: [true, "minMaxExample field is required"],
        },
        enumExample: {
            type: String,
            enum: {
                values: ["Coffee", "Tea"],
                message: "{VALUE} is not supported",
            },
        },
        customValidatorExample: {
            type: Number,
            validate: {
                validator: function (v: number) {
                    return v % 2 == 0;
                },
                message: "Nem páros számot adott meg!",
            },
        },
        dateExample: {
            type: Date,
            default: new Date(),
            max: ["2100-12-31", "Csak 21. századi dátumot adhat meg!"],
            validate: {
                validator: function (v: Date) {
                    return v >= new Date();
                },
                message: "Az aktuális dátumnál nem adhat meg korábbi dátumot!",
            },
        },
    },
    // Virtuals are not included in string version of the model instances by default.
    // To include them, set the virtuals option to true on schema’s toObject and toJSON options.
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Mongoose also supports populating virtuals.
// The ref option, which tells Mongoose which model to populate documents from.
// The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.
// justOne says that it'll populate a single connected object, set it to false if you need to get an array
// You can give the "populateField" any name you want:
// nsideSchema.virtual("populateField", {
//     ref: "oneside",
//     localField: "FK_neve",
//     foreignField: "_id",
//     justOne: true,
// });
// Use virtual for populate in controller:
// const data = await this.nsideM.find().populate("populateField", "-_id field1 field2 -field3 ...");

nsideSchema.plugin(AutoIncrementID, {});

const nsideModel = model("nside", nsideSchema, "TáblaNeveN");

export default nsideModel;
