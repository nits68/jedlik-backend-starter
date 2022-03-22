import { Schema, model } from "mongoose";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

// ref: "inside" -> 1 oldali modell neve, nem kell átírni!

const nsideSchema = new Schema(
    {
        _id: Number,
        oneside: {
            ref: "oneside",
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        dateAdded: {
            type: Date,
            default: new Date(),
        },
        isGlutenFree: {
            type: Boolean,
            required: true,
        },
        prepTime: {
            type: Number,
            required: true,
        },
        easyOfPrep: {
            type: Number,
            min: [1, "Too few stars, got {VALUE}"],
            max: [5, "Too many stars, got {VALUE}"],
            required: [true, "easyOfPrep field is required"],
            unique: true,
            dropDups: true,
        },
    },
    { versionKey: false },
);

const nsideModel = model("nside", nsideSchema, "TáblaNeveN");

export default nsideModel;
