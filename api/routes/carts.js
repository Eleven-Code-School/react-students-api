import express from "express";
import { CartCreateSchema, CartItemSchema } from "../_lib/schemas.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const parsed = CartCreateSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const created = await Cart.create({ userId: parsed.data.userId });
    res.status(201).json(created);
});

router.get("/", async (req, res) => {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const items = await Cart.find(query).lean();
    res.json({ items, total: items.length });
});

router.get("/:id", async (req, res) => {
    const cart = await Cart.findById(req.params.id).lean();
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
});

router.post("/:id/items", async (req, res) => {
    const parsed = CartItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const product = await Product.findById(parsed.data.productId).lean();
    if (!product) return res.status(400).json({ error: "Product does not exist" });

    const existing = cart.items.find((i) => String(i.productId) === String(parsed.data.productId));
    if (existing) {
        existing.qty += parsed.data.qty;
    } else {
        cart.items.push({ productId: product._id, qty: parsed.data.qty, priceSnapshot: product.price });
    }
    await cart.save();
    res.status(201).json(cart);
});

router.patch("/:id/items/:productId", async (req, res) => {
    const qty = Number(req.body?.qty);
    if (!Number.isInteger(qty)) return res.status(400).json({ error: "qty must be integer" });

    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const idx = cart.items.findIndex((i) => String(i.productId) === String(req.params.productId));
    if (idx === -1) return res.status(404).json({ error: "Item not found in cart" });

    if (qty <= 0) {
        cart.items.splice(idx, 1);
    } else {
        cart.items[idx].qty = qty;
    }
    await cart.save();
    res.json(cart);
});

router.delete("/:id/items/:productId", async (req, res) => {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => String(i.productId) != String(req.params.productId));
    await cart.save();
    res.json({ ok: true, removed: before !== cart.items.length, cart });
});

router.get("/:id/summary", async (req, res) => {
    const cart = await Cart.findById(req.params.id).lean();
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const subtotal = cart.items.reduce((acc, i) => acc + i.priceSnapshot * i.qty, 0);
    const taxRate = 0.21;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    res.json({ subtotal, taxRate, tax, total, currency: "EUR" });
});

router.post("/:id/checkout", async (req, res) => {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    if (cart.status === "ordered") return res.status(400).json({ error: "Cart already ordered" });
    cart.status = "ordered";
    cart.orderedAt = new Date();
    await cart.save();
    res.json({ ok: true, cart });
});

export default router;
