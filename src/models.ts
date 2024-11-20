import { Schema, SchemaDefinition, model } from "mongoose";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html
// https://transform.tools/json-to-mongoose

// ************************************************
const oneSideSchema = new Schema<SchemaDefinition>(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// ************************************************
const manySideSchema = new Schema<SchemaDefinition>(
    {
        _id: Number,
        FK_neve: {
            ref: "oneSideID", // "oneSideID" -> 1 oldali modell azonosítója, nem kell átírni!
            type: Number,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 60,
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: [500, "A leírás maximum 500 karakter lehet!"],
        },
        isGlutenFree: {
            type: Boolean,
            required: true,
        },
        prepTime: {
            type: Number,
            required: true,
            default: 12,
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
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Mongoose also supports populating virtuals.
// Help: https://mongoosejs.com/docs/tutorials/virtuals.html#populate
// You can give the "virtualPop" any name you want:

// Access oneSide from manySide:
// manySideSchema.virtual("virtualPop", {
//     ref: "oneSideID",
//     localField: "FK_neve",
//     foreignField: "_id", //ref_Field
//     justOne: true,
// });
// Use virtual for populate in manySide controller:
// const data = await this.many.find({},"-_id").populate("virtualPop", "-_id -prepTime");

// Access manySide from oneSide:
// oneSideSchema.virtual("virtualPop", {
//     ref: "manySideID",
//     localField: "_id",
//     foreignField: "FK_neve", //ref_Field
//     justOne: false,
// });
// Use virtual for populate in oneSide controller:
// const data = await this.one.find({},"-_id").populate("virtualPop", "-_id");

export const oneSideModel = model("oneSideID", oneSideSchema, "TáblaNeveOne");
export const manySideModel = model("manySideID", manySideSchema, "TáblaNeveMany");
