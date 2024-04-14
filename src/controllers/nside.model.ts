import { Schema, SchemaDefinition, model } from "mongoose";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html
// https://transform.tools/json-to-mongoose

const nsideSchema = new Schema<SchemaDefinition>(
    {
        _id: Number, // default type of PK (with _id identifier): Schema.Types.ObjectId
        FK_neve: {
            ref: "oneside", // "onside" -> 1 oldali modell neve, nem kell átírni!
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
    // Mongoose Virtuals: https://mongoosejs.com/docs/tutorials/virtuals.html
    // Virtuals are not included in string version of the model instances by default.
    // To include them, set the virtuals option to true on schema’s toObject and toJSON options.
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Mongoose also supports populating virtuals.
// Help: https://mongoosejs.com/docs/tutorials/virtuals.html#populate
// You can give the "virtualPop" any name you want:
// nsideSchema.virtual("virtualPop", {
//     ref: "oneside",
//     localField: "FK_neve",
//     foreignField: "_id", //ref_Field
//     justOne: true,
// });

// Use virtual for populate in nSide controller:
// const data = await this.nsideM.find().populate("populateFieldNside", "-_id field1 field2 -field3 ...");

const nsideModel = model("nside", nsideSchema, "TáblaNeveN");

export default nsideModel;
