import mongoose from "mongoose";

// ✅ Define a proper type for cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// ✅ Extend globalThis safely
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const FALLBACK_URI = process.env.MONGODB_URI_FALLBACK;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined");
}

// ✅ Initialize cache
const cached: MongooseCache =
  global.mongooseCache ?? { conn: null, promise: null };

global.mongooseCache = cached;

export async function connect() {
  if (cached.conn) {
    console.log("✅ Using cached connection");
    return cached.conn;
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    if (!cached.promise) {
      console.log("🔌 Connecting via SRV...");
      cached.promise = mongoose.connect(MONGODB_URI!, opts);
    }

    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB (SRV)");
    return cached.conn;

  } catch (err: any) {
    console.error("❌ SRV failed:", err.message);

    // reset broken promise
    cached.promise = null;

    if (!FALLBACK_URI) {
      throw new Error("🚨 No fallback URI provided");
    }

    try {
      console.log("🔁 Trying fallback...");
      cached.conn = await mongoose.connect(FALLBACK_URI, opts);
      console.log("✅ Connected (fallback)");
      return cached.conn;

    } catch (fallbackErr: any) {
      console.error("❌ Fallback failed:", fallbackErr.message);
      throw fallbackErr;
    }
  }
}