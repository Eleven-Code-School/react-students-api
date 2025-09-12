import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
    console.warn("[mongo] MONGODB_URI no está definida. Defínela en env para conectar a la BD.");
}

let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const uri = MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI no configurada");
        cached.promise = mongoose
            .connect(uri, {
                maxPoolSize: 5,
                serverSelectionTimeoutMS: 5000,
            })
            .then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
