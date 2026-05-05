import mongoose from "mongoose";

declare global {
  // Ensure this is in global scope
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// It must export something to be considered a module
export {};
