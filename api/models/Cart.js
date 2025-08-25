import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    priceSnapshot: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["active", "ordered"], default: "active" },
        items: { type: [CartItemSchema], default: [] },
        orderedAt: Date,
    },
    { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
