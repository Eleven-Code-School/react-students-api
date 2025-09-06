import Product from "../models/Product.js";
import User from "../models/User.js";

export async function seedIfNeeded() {
    if (process.env.SEED !== "true") return;
    const count = await Product.countDocuments();
    if (count > 0) return; // idempotente

    console.log("[seed] Insertando seeds");

    const [p1, p2, p3] = await Product.insertMany([
        {
            sku: "TS-001",
            name: "Camiseta básica blanca",
            price: 15.99,
            stock: 120,
            rating: 4.5,
            image: "https://picsum.photos/seed/product1/600/400",
            categoryId: "cat-tops",
            description: "100% algodón, corte regular.",
        },
        {
            sku: "SW-101",
            name: "Sudadera con capucha",
            price: 39.9,
            stock: 80,
            rating: 4.2,
            image: "https://picsum.photos/seed/product2/600/400",
            categoryId: "cat-hoodies",
            description: "Suave y calentita.",
        },
        {
            sku: "CP-050",
            name: "Gorra negra",
            price: 12.5,
            stock: 200,
            rating: 4.1,
            image: "https://picsum.photos/seed/product3/600/400",
            categoryId: "cat-caps",
            description: "Ajustable.",
        },
    ]);

    const user = await User.create({ name: "Grace Hopper", email: "grace@example.com", role: "user" });

    console.log("[seed] Insertados productos y usuario de ejemplo.");
}
