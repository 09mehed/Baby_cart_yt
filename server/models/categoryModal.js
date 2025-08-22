import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        categoryType: {
            type: String,
            required: true,
            enum: ["Featured", "Hot Categories", "Top Categories"]
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model("category", categorySchema);

export default Category;