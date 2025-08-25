import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        sku: { type: String, required: true },
        name: { type: String, required: true },
        description: String,
        categoryId: String,
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        rating: Number,
        image: String,
    },
    { timestamps: true },
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
