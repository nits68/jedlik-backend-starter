import { Schema, model } from "mongoose";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const recipeSchema = new Schema(
    {
        _id: Number,
        author: {
            ref: "author",
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

const recipeModel = model("recipe", recipeSchema, "recipes");

export default recipeModel;
