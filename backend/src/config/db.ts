import mongoose from "mongoose";

// Single responsibility: connect to MongoDB, and fail loudly if it can't.
// We exit the process on failure rather than let the server run in a broken
// half-working state.
export const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
