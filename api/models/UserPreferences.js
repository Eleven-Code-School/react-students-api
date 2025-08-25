import mongoose from "mongoose";

const UserPreferencesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true },
        currency: { type: String, enum: ["EUR", "USD"], default: "EUR" },
        language: { type: String, enum: ["es", "en"], default: "es" },
        theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        marketingOptIn: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.UserPreferences || mongoose.model("UserPreferences", UserPreferencesSchema);
