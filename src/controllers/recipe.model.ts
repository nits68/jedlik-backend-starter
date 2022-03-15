import { Schema, model } from "mongoose";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const recipeSchema = new Schema(
    {
        _id: Number,
        author: {
            ref: "author",
            type: Number,
            required: [true, "author field is required"],
        },
        name: {
            type: String,
            required: [true, "recepeName field is required"],
            unique: true,
            dropDups: true,
        },
        imageURL: {
            type: String,
            required: [true, "imageURL field is required"],
        },
        description: {
            type: String,
            required: [true, "description field is required"],
        },
        dateAdded: {
            type: Date,
            default: new Date(),
        },
        isGlutenFree: {
            type: Boolean,
            required: [true, "isGlutenFree field is required"],
        },
        prepTime: {
            type: Number,
            required: [true, "prepTime field is required"],
        },
        easyOfPrep: {
            type: Number,
            min: [1, "Too few stars, got {VALUE}"],
            max: [5, "Too many stars, got {VALUE}"],
            required: [true, "easyOfPrep field is required"],
        },
    },
    { versionKey: false },
);

const recipeModel = model("recipe", recipeSchema, "recipes");

export default recipeModel;
