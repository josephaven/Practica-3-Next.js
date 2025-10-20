// lib/mongodb.ts
import mongoose from "mongoose";

type Cached = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Evitar múltiples conexiones en dev/hot-reload
declare global {
    // eslint-disable-next-line no-var
    var _mongooseCached: Cached | undefined;
}

const cached: Cached =
    global._mongooseCached ?? (global._mongooseCached = { conn: null, promise: null });

export async function connectMongo(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    const { MONGODB_URI, MONGODB_DB } = process.env;

    // 👉 Guard clause: aquí se estrecha el tipo (narrowing)
    if (!MONGODB_URI) {
        throw new Error("Falta MONGODB_URI en variables de entorno");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                // `dbName` admite string | undefined
                dbName: MONGODB_DB ?? undefined,
            })
            .then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
