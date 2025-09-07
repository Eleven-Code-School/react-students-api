import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        sku: { type: String, required: true },
        name: { type: String, required: true },
        description: String,
        categoryId: String,
        price: { type: Number, required: true },
        stock: { type: Number, required: false, default: 10 },
        rating: Number,
        image: String,
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
