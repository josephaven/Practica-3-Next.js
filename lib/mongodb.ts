import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("⚠️ MONGODB_URI no está definida en .env");

let cached = (global as any)._mongoose as {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

if (!cached) {
    cached = (global as any)._mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "next_crud",
            bufferCommands: false,
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
