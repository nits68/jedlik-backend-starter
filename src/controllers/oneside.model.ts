// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

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

onesideSchema.plugin(AutoIncrementID, {});

const onesideModel = model("oneside", onesideSchema, "TáblaNeve1");

export default onesideModel;
