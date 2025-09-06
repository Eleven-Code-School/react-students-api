import express from "express";
import { ProductSchema } from "../_lib/schemas.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { search = "", page = 1, limit = 20, categoryId, sort } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    if (categoryId) query.categoryId = categoryId;

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(100, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const sortObj = {};
    if (sort === "price") sortObj.price = 1;
    if (sort === "rating") sortObj.rating = -1;

    const [items, total] = await Promise.all([
        Product.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
        Product.countDocuments(query),
    ]);

    res.json({ items, total, page: pageNum, limit: limitNum });
});

router.post("/", async (req, res) => {
    const parsed = ProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const created = await Product.create(parsed.data);
    res.status(201).json(created);
});

router.get("/:id", async (req, res) => {
    const item = await Product.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "Product not found" });
    res.json(item);
});

router.patch("/:id", async (req, res) => {
    const parsed = ProductSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const updated = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: parsed.data },
        { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true, removed: deleted });
});

export default router;
