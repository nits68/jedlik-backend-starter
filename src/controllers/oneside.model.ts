// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const onesideSchema = new Schema(
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
    { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const onesideModel = model("oneside", onesideSchema, "TáblaNeve1");

export default onesideModel;
