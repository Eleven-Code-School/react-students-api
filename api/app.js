import cors from "cors";
import express from "express";

import authRouter from "./routes/auth.js";
import booksRouter from "./routes/books.js";
import cartsRouter from "./routes/carts.js";
import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";

import { connectMongo } from "./_lib/mongo.js";
import { seedIfNeeded } from "./_lib/seed.js";

const app = express();

app.use(cors());
app.use(express.json());

// Ensure connection before handling routes
app.use(async (req, res, next) => {
    try {
        await connectMongo();
        await seedIfNeeded();
        next();
    } catch (err) {
        console.error("[mongo] connection error:", err);
        res.status(500).json({ error: "Mongo connection failed" });
    }
});

app.get("/api", (req, res) => {
    res.json({
        status: "ok",
        name: "Eleven Code - React Students API",
        version: "1.1.0",
        time: new Date().toISOString(),
    });
});

app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);

// 404
app.use((req, res) => {
    res.status(404).json({ error: "Not Found", path: req.path });
});

export default app;
