import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const BookSchema = new mongoose.Schema(
    {
        // Campos básicos para card view
        title: { type: String, required: true },
        author: { type: String, required: true },
        isbn: { type: String, required: false, unique: true, sparse: true },
        shortDescription: { type: String, required: true, maxlength: 200 },
        coverImage: { type: String, required: false },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },

        // Campos adicionales para detail view
        extendedDescription: { type: String, required: true },
        publisher: { type: String, required: false },
        publishedDate: { type: Date, required: false },
        pages: { type: Number, required: false, min: 1 },
        language: { type: String, required: false, default: "Spanish" },
        format: {
            type: String,
            enum: ["Paperback", "Hardcover", "eBook", "Audiobook"],
            default: "Paperback",
        },

        // Campos de negocio
        stock: { type: Number, required: true, default: 0, min: 0 },
        featured: { type: Boolean, default: false },
        active: { type: Boolean, default: true },

        // Reviews integradas
        reviews: { type: [ReviewSchema], default: [] },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0, min: 0 },
    },
    {
        timestamps: true,
        strict: false,
        minimize: false,
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Middleware para calcular rating promedio automáticamente
BookSchema.pre("save", function (next) {
    if (this.reviews && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10; // 1 decimal
        this.totalReviews = this.reviews.length;
    } else {
        this.averageRating = 0;
        this.totalReviews = 0;
    }
    next();
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
