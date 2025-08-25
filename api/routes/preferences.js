import express from "express";
import UserPreferences from "../models/UserPreferences.js";
import { PreferencesSchema } from "../_lib/schemas.js";

const router = express.Router();

router.get("/", async (_req, res) => {
    const items = await UserPreferences.find().lean();
    res.json({ items, total: items.length });
});

router.post("/", async (req, res) => {
    const parsed = PreferencesSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const created = await UserPreferences.create(parsed.data);
    res.status(201).json(created);
});

router.get("/:id", async (req, res) => {
    const item = await UserPreferences.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "Preferences not found" });
    res.json(item);
});

router.patch("/:id", async (req, res) => {
    const parsed = PreferencesSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const updated = await UserPreferences.findByIdAndUpdate(req.params.id, { $set: parsed.data }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: "Preferences not found" });
    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const deleted = await UserPreferences.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "Preferences not found" });
    res.json({ ok: true, removed: deleted });
});

export default router;
