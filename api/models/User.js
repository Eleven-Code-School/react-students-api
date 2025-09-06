// api/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        password: { type: String },
    },
    { strict: false, minimize: false, timestamps: true }
);

UserSchema.set("toJSON", {
    transform(_doc, ret) {
        delete ret.password;
        return ret;
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
