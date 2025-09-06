import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true },
        priceSnapshot: { type: Number, required: true },
    },
    {
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

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["active", "ordered"], default: "active" },
        items: { type: [CartItemSchema], default: [] },
        orderedAt: Date,
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

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
