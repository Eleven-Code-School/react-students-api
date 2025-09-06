import express from "express";
import { PreferencesSchema, UserSchema } from "../_lib/schemas.js";
import User from "../models/User.js";
import UserPreferences from "../models/UserPreferences.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const items = await User.find().lean();
    items.forEach((item) => delete item.password);
    res.json({ items, total: items.length });
});

router.get("/:id", async (req, res) => {
    const item = await User.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "User not found" });
    delete item.password;
    res.json(item);
});

router.patch("/:id", async (req, res) => {
    const parsed = UserSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    delete parsed.password;
    const updated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: parsed.data },
        { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, removed: deleted });
});

// Preferences for a specific user
router.get("/:id/preferences", async (req, res) => {
    const pref = await UserPreferences.findOne({ userId: req.params.id }).lean();
    if (!pref) return res.status(404).json({ error: "Preferences not found for user" });
    res.json(pref);
});

router.patch("/:id/preferences", async (req, res) => {
    const parsed = PreferencesSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const updated = await UserPreferences.findOneAndUpdate(
        { userId: req.params.id },
        { $set: parsed.data },
        { new: true, upsert: true }
    ).lean();
    res.json(updated);
});

export default router;
