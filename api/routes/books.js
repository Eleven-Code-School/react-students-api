import express from "express";
import { authRequired } from "../_lib/auth.js";
import { BookSchema, ReviewSchema, formatValidationError } from "../_lib/schemas.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/books - Listar todos los libros con filtros
router.get("/", async (req, res) => {
    const { search = "", category, featured, active = "true", sort } = req.query;
    const query = {};

    // Filtros
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
        ];
    }
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === "true";
    if (active !== undefined) query.active = active === "true";

    // Ordenamiento
    const sortObj = {};
    if (sort === "price-asc") sortObj.price = 1;
    if (sort === "price-desc") sortObj.price = -1;
    if (sort === "rating") sortObj.averageRating = -1;
    if (sort === "newest") sortObj.createdAt = -1;
    if (sort === "title") sortObj.title = 1;

    const books = await Book.find(query).sort(sortObj);
    res.json(books);
});

// POST /api/books - Crear nuevo libro (requiere autenticación)
router.post("/", authRequired, async (req, res) => {
    const parsed = BookSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = formatValidationError(parsed.error);
        return res.status(400).json({ error });
    }

    const created = await Book.create(parsed.data);
    res.status(201).json(created);
});

// GET /api/books/:id - Obtener libro por ID (vista detallada)
router.get("/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
});

// PATCH /api/books/:id - Actualizar libro (requiere autenticación)
router.patch("/:id", authRequired, async (req, res) => {
    const parsed = BookSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        const error = formatValidationError(parsed.error);
        return res.status(400).json({ error });
    }

    const updated = await Book.findByIdAndUpdate(
        req.params.id,
        { $set: parsed.data },
        { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.json(updated);
});

// DELETE /api/books/:id - Eliminar libro (requiere autenticación)
router.delete("/:id", authRequired, async (req, res) => {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.json({ ok: true, removed: deleted });
});

// POST /api/books/:id/reviews - Agregar review a un libro (requiere autenticación)
router.post("/:id/reviews", authRequired, async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Obtener información del usuario
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validar datos de la review
    const reviewData = {
        ...req.body,
        userId: req.user.id,
        userName: user.name,
    };

    const parsed = ReviewSchema.safeParse(reviewData);
    if (!parsed.success) {
        const error = formatValidationError(parsed.error);
        return res.status(400).json({ error });
    }

    // Verificar si el usuario ya ha hecho una review
    const existingReview = book.reviews.find((review) => review.userId.toString() === req.user.id);
    if (existingReview) {
        return res.status(409).json({ error: "User has already reviewed this book" });
    }

    // Agregar la review
    book.reviews.push(parsed.data);
    await book.save(); // Esto disparará el middleware que calcula el rating promedio

    res.status(201).json(book);
});

// GET /api/books/:id/reviews - Obtener reviews de un libro
router.get("/:id/reviews", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book.reviews);
});

// DELETE /api/books/:id/reviews/:reviewId - Eliminar review (requiere autenticación)
router.delete("/:id/reviews/:reviewId", authRequired, async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const reviewIndex = book.reviews.findIndex((review) => review._id.toString() === req.params.reviewId);

    if (reviewIndex === -1) {
        return res.status(404).json({ error: "Review not found" });
    }

    // Verificar que el usuario sea el autor de la review o sea admin
    const review = book.reviews[reviewIndex];
    if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    // Eliminar la review
    book.reviews.splice(reviewIndex, 1);
    await book.save(); // Recalcular rating promedio

    res.json({ ok: true, message: "Review deleted successfully", book });
});

export default router;
