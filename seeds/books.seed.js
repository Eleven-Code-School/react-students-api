// scripts/booksSeed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Book from "../api/models/Book.js";

dotenv.config();

const seedBooks = [
    {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        shortDescription: "La obra maestra del realismo mágico.",
        extendedDescription:
            "Relata la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo.",
        coverImage: "https://picsum.photos/seed/book1/400/600",
        price: 19.99,
        category: "Novela",
        publisher: "Editorial Sudamericana",
        publishedDate: new Date("1967-05-30"),
        pages: 471,
        language: "Español",
        format: "Paperback",
        stock: 50,
        featured: true,
    },
    {
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        shortDescription: "El clásico eterno de la literatura española.",
        extendedDescription:
            "La historia de un hidalgo que pierde la cordura y decide convertirse en caballero andante.",
        coverImage: "https://picsum.photos/seed/book2/400/600",
        price: 24.99,
        category: "Clásico",
        publisher: "Francisco de Robles",
        publishedDate: new Date("1605-01-16"),
        pages: 863,
        language: "Español",
        format: "Hardcover",
        stock: 30,
        featured: true,
    },
    {
        title: "El señor de los anillos",
        author: "J. R. R. Tolkien",
        shortDescription: "La gran epopeya fantástica.",
        extendedDescription: "Una aventura épica para destruir el Anillo Único y salvar la Tierra Media.",
        coverImage: "https://picsum.photos/seed/book3/400/600",
        price: 39.99,
        category: "Fantasía",
        publisher: "George Allen & Unwin",
        publishedDate: new Date("1954-07-29"),
        pages: 1216,
        language: "Inglés",
        format: "Hardcover",
        stock: 80,
    },
    {
        title: "Harry Potter y la piedra filosofal",
        author: "J. K. Rowling",
        shortDescription: "El inicio de la saga mágica más famosa.",
        extendedDescription: "Harry descubre que es un mago y comienza su aventura en Hogwarts.",
        coverImage: "https://picsum.photos/seed/book4/400/600",
        price: 14.99,
        category: "Juvenil",
        publisher: "Bloomsbury",
        publishedDate: new Date("1997-06-26"),
        pages: 223,
        language: "Inglés",
        format: "Paperback",
        stock: 100,
    },
    {
        title: "1984",
        author: "George Orwell",
        shortDescription: "La distopía más influyente del siglo XX.",
        extendedDescription: "Un mundo controlado por el Gran Hermano donde la libertad no existe.",
        coverImage: "https://picsum.photos/seed/book5/400/600",
        price: 12.5,
        category: "Distopía",
        publisher: "Secker & Warburg",
        publishedDate: new Date("1949-06-08"),
        pages: 328,
        language: "Inglés",
        format: "Paperback",
        stock: 60,
    },
    {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        shortDescription: "Cuando leer se convierte en un crimen.",
        extendedDescription: "Un futuro en el que los libros están prohibidos y los bomberos los queman.",
        coverImage: "https://picsum.photos/seed/book6/400/600",
        price: 13.99,
        category: "Distopía",
        publisher: "Ballantine Books",
        publishedDate: new Date("1953-10-19"),
        pages: 158,
        language: "Inglés",
        format: "Paperback",
        stock: 40,
    },
    {
        title: "El Principito",
        author: "Antoine de Saint-Exupéry",
        shortDescription: "Un cuento poético sobre la vida y la amistad.",
        extendedDescription: "Un piloto conoce a un pequeño príncipe proveniente de otro planeta.",
        coverImage: "https://picsum.photos/seed/book7/400/600",
        price: 9.99,
        category: "Infantil",
        publisher: "Reynal & Hitchcock",
        publishedDate: new Date("1943-04-06"),
        pages: 96,
        language: "Francés",
        format: "Paperback",
        stock: 120,
    },
    {
        title: "Crimen y castigo",
        author: "Fiódor Dostoyevski",
        shortDescription: "El dilema moral de Raskólnikov.",
        extendedDescription:
            "Un joven estudiante comete un asesinato y enfrenta las consecuencias psicológicas.",
        coverImage: "https://picsum.photos/seed/book8/400/600",
        price: 17.5,
        category: "Novela",
        publisher: "The Russian Messenger",
        publishedDate: new Date("1866-01-01"),
        pages: 671,
        language: "Ruso",
        format: "Paperback",
        stock: 35,
    },
    {
        title: "La sombra del viento",
        author: "Carlos Ruiz Zafón",
        shortDescription: "Un viaje por la Barcelona mágica y literaria.",
        extendedDescription:
            "Daniel Sempere descubre un libro maldito en el Cementerio de los Libros Olvidados.",
        coverImage: "https://picsum.photos/seed/book9/400/600",
        price: 16.99,
        category: "Misterio",
        publisher: "Planeta",
        publishedDate: new Date("2001-04-17"),
        pages: 565,
        language: "Español",
        format: "Paperback",
        stock: 75,
    },
    {
        title: "It",
        author: "Stephen King",
        shortDescription: "El payaso más terrorífico de la literatura.",
        extendedDescription: "Un grupo de niños enfrenta a una entidad maligna en Derry.",
        coverImage: "https://picsum.photos/seed/book10/400/600",
        price: 22.99,
        category: "Terror",
        publisher: "Viking Press",
        publishedDate: new Date("1986-09-15"),
        pages: 1138,
        language: "Inglés",
        format: "Hardcover",
        stock: 50,
    },
    // 👉 añade 10 más similares para llegar a 20
];

async function runSeed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ Conectado a MongoDB");

        // Borrar libros existentes
        await Book.deleteMany({});
        console.log("🗑️ Libros anteriores eliminados");

        // Insertar nuevos
        const inserted = await Book.insertMany(seedBooks);
        console.log(`📚 Se insertaron ${inserted.length} libros`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error al ejecutar seed:", error);
        process.exit(1);
    }
}

runSeed();
