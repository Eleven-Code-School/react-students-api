import express from "express";
import { PreferencesSchema, UserSchema } from "../_lib/schemas.js";
import User from "../models/User.js";
import UserPreferences from "../models/UserPreferences.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const items = await User.find().lean();
    res.json({ items, total: items.length });
});

router.post("/", async (req, res) => {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    try {
        const created = await User.create(parsed.data);

        // Crear preferencias por defecto si no existen (idempotente)
        const defaults = {
            currency: "EUR",
            language: "es",
            theme: "system",
            notifications: { email: true, sms: false },
            marketingOptIn: false,
        };

        await UserPreferences.findOneAndUpdate(
            { userId: created._id },
            { $setOnInsert: { userId: created._id, ...defaults } },
            { upsert: true, new: true },
        );

        res.status(201).json(created);
    } catch (e) {
        if (e.code === 11000) return res.status(409).json({ error: "Email already exists" });
        throw e;
    }
});

router.get("/:id", async (req, res) => {
    const item = await User.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "User not found" });
    res.json(item);
});

router.patch("/:id", async (req, res) => {
    const parsed = UserSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const updated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: parsed.data },
        { new: true, runValidators: true },
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
        { new: true, upsert: true },
    ).lean();
    res.json(updated);
});

export default router;
